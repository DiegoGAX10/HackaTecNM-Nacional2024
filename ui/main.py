import dash
from dash import dcc, html, Input, Output, State, callback_context
import plotly.graph_objects as go
import trimesh
import json
import numpy as np
import base64
import io

# Colors for pieces
colores = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FDCB6E',
    '#6C5CE7', '#A8E6CF', '#FF8ED4', '#FAD390',
    '#55E6C1', '#5F27CD', '#48DBFB', '#FF6B6B'
]

# Initial configuration
direcciones = ['de abajo hacia arriba', 'de derecha a izquierda', 'de izquierda a derecha', 'de arriba hacia abajo']


# Function to load STL from bytes
def load_stl_from_bytes(contents):
    try:
        content_type, content_string = contents.split(',')
        decoded = base64.b64decode(content_string)

        # Verificar tamaño del archivo
        print(f"Tamaño del archivo decodificado: {len(decoded)} bytes")

        mesh = trimesh.load_mesh(io.BytesIO(decoded), file_type='stl')

        # Verificar mesh
        print(f"Número de vértices: {len(mesh.vertices)}")
        print(f"Número de caras: {len(mesh.faces)}")

        return mesh
    except Exception as e:
        print(f"Error detallado al cargar STL: {e}")
        import traceback
        traceback.print_exc()
        return None


# Create initial figure
def crear_figura(componentes, selected_piece=None, current_camera=None):
    if not componentes:
        print("No hay componentes para crear la figura")
        return go.Figure()

    fig = go.Figure()

    for idx, componente in enumerate(componentes):
        try:
            # Verificar datos del componente
            print(f"Componente {idx}: {len(componente.vertices)} vértices, {len(componente.faces)} caras")

            pieza_config = {
                'color': colores[idx % len(colores)],
                'habilitado': True
            }

            # Create mesh for each component
            x = componente.vertices[:, 0]
            y = componente.vertices[:, 1]
            z = componente.vertices[:, 2]

            # Use Plotly's Mesh3d for 3D visualization
            mesh = go.Mesh3d(
                x=x,
                y=y,
                z=z,
                i=componente.faces[:, 0],
                j=componente.faces[:, 1],
                k=componente.faces[:, 2],
                color=pieza_config['color'],
                opacity=0.7 if selected_piece is not None and idx != selected_piece else 1.0,
                name=f'Piece {idx}'
            )

            fig.add_trace(mesh)

        except Exception as e:
            print(f"Error procesando componente {idx}: {e}")

    # Configure layout
    fig.update_layout(
        scene=dict(
            aspectmode='data',
            camera=current_camera or {
                'up': {'x': 0, 'y': 1, 'z': 0},
                'center': {'x': 0, 'y': 0, 'z': 0},
                'eye': {'x': 1.5, 'y': 1.5, 'z': 1.5}
            }
        ),
        showlegend=True,
        margin=dict(l=0, r=0, t=0, b=0)
    )

    return fig
# Create Dash app
app = dash.Dash(__name__, suppress_callback_exceptions=True)

# Application layout
app.layout = html.Div([
    html.H1("Reconstrucción de Modelo 3D Interactivo"),
    dcc.Upload(
        id='upload-stl',
        children=html.Div([
            'Arrastra y suelta o ',
            html.A('Selecciona un archivo STL')
        ]),
        style={
            'width': '100%',
            'height': '60px',
            'lineHeight': '60px',
            'borderWidth': '1px',
            'borderStyle': 'dashed',
            'borderRadius': '5px',
            'textAlign': 'center',
            'margin': '10px'
        },
        multiple=False
    ),
    html.Div(id='output-stl-upload'),
    dcc.Store(id='camera-state-store', data=None),
    html.Div(id='modelo-3d-container', children=[
        dcc.Graph(
            id='modelo-3d',
            figure=go.Figure(),  # Empty initial figure
            style={'height': '600px'},
            config={'displayModeBar': True, 'scrollZoom': True}
        )
    ]),

    # Configuration Panel
    html.Div([
        html.H3("Configuración de Piezas"),
        dcc.Dropdown(
            id='dropdown-pieza',
            options=[],
            value=None,
            style={'width': '200px', 'marginBottom': '20px'}
        ),
        html.Div([
            html.Label('Dirección'),
            dcc.Dropdown(
                id='direccion-pieza',
                options=[{'label': direccion, 'value': direccion} for direccion in direcciones],
                value=None,
                style={'width': '200px', 'marginBottom': '20px'}
            ),
            html.Label('Prioridad'),
            dcc.Input(
                id='prioridad-pieza',
                type='number',
                value=None,
                style={'width': '200px', 'marginBottom': '20px'}
            ),
            html.Div(id='texto-modificado', children=''),
            html.Button(
                'Guardar Configuración',
                id='guardar-configuracion',
                style={
                    'marginTop': '10px',
                    'padding': '10px',
                    'backgroundColor': '#4CAF50',
                    'color': 'white',
                    'border': 'none',
                    'borderRadius': '5px',
                    'cursor': 'pointer'
                }
            ),
            html.Button(
                'Ocultar/Mostrar Pieza',
                id='toggle-pieza',
                style={
                    'marginTop': '10px',
                    'padding': '10px',
                    'backgroundColor': '#FF9800',
                    'color': 'white',
                    'border': 'none',
                    'borderRadius': '5px',
                    'cursor': 'pointer'
                }
            ),
            html.Label('\nTexto de Ayuda'),
            dcc.Textarea(
                id='ayuda-pieza',
                placeholder='Escribe una nota o advertencia sobre esta pieza...',
                value='',
                style={
                    'width': '100%',
                    'height': 100,
                    'marginBottom': '20px'
                }
            ),
        ], id='panel-pieza', style={'padding': '20px', 'backgroundColor': '#f4f4f4', 'borderRadius': '5px'})
    ]),

    # JSON Export Button
    html.Button(
        "Generar JSON para Unity",
        id='generar-json',
        style={
            'marginTop': '20px',
            'padding': '10px',
            'backgroundColor': '#FFC107',
            'color': 'white',
            'border': 'none',
            'borderRadius': '5px',
            'cursor': 'pointer'
        }
    ),
    dcc.Store(id='stl-components-store'),
    dcc.Store(id='pieza-seleccionada-store', data=None),
    dcc.Store(id='configuracion-store', data=None),
    dcc.Download(id="download-json")
], className='container')


# Callback to handle STL upload
@app.callback(
    [Output('stl-components-store', 'data'),
     Output('output-stl-upload', 'children'),
     Output('modelo-3d', 'figure'),
     Output('dropdown-pieza', 'options')],
    [Input('upload-stl', 'contents')],
    [State('upload-stl', 'filename')],
    prevent_initial_call=True
)
def update_stl_model(contents, filename):
    if contents is not None:
        try:
            mesh = load_stl_from_bytes(contents)

            if mesh is not None:
                componentes = mesh.split()
                if not componentes:
                    return (
                        None,
                        html.Div('El archivo STL no pudo ser dividido en componentes'),
                        go.Figure(),
                        []
                    )

                # Generate piece configuration
                configuracion_piezas = [
                    {
                        'id': i,
                        'direccion': 'de abajo hacia arriba',
                        'prioridad': i,
                        'habilitado': True,
                        'color': colores[i % len(colores)],
                        'coordenadas_finales': {
                            'x': componente.vertices[:, 0].tolist(),
                            'y': componente.vertices[:, 1].tolist(),
                            'z': componente.vertices[:, 2].tolist(),
                            'rotacion_x': 0,
                            'rotacion_y': 0,
                            'rotacion_z': 0
                        },
                        'ayuda': ''
                    } for i, componente in enumerate(componentes)
                ]

                # Create initial figure
                figura = crear_figura(componentes)

                # Piece dropdown options
                piece_options = [{'label': f'Pieza {i + 1}', 'value': i} for i in range(len(componentes))]

                return (
                    json.dumps([comp.vertices.tolist() for comp in componentes]),
                    html.Div(f'Archivo {filename} cargado: {len(componentes)} componentes'),
                    figura,
                    piece_options
                )

        except Exception as e:
            return None, html.Div(f'Error al procesar: {str(e)}'), go.Figure(), []

    return None, html.Div('Por favor carga un archivo STL'), go.Figure(), []


# Main piece configuration callback
@app.callback(
    [Output('direccion-pieza', 'value', {'allow_duplicate': True}),
     Output('prioridad-pieza', 'value', {'allow_duplicate': True}),
     Output('ayuda-pieza', 'value', {'allow_duplicate': True}),
     Output('texto-modificado', 'children', {'allow_duplicate': True}),
     Output('configuracion-store', 'data', {'allow_duplicate': True}),
     Output('modelo-3d', 'figure', {'allow_duplicate': True}),
     Output('dropdown-pieza', 'value', {'allow_duplicate': True}),
     Output('camera-state-store', 'data', {'allow_duplicate': True})],
    [Input('dropdown-pieza', 'value'),
     Input('direccion-pieza', 'value'),
     Input('prioridad-pieza', 'value'),
     Input('ayuda-pieza', 'value'),
     Input('guardar-configuracion', 'n_clicks'),
     Input('toggle-pieza', 'n_clicks'),
     Input('modelo-3d', 'clickData'),
     Input('modelo-3d', 'relayoutData')],
    [State('configuracion-store', 'data'),
     State('dropdown-pieza', 'value'),
     State('modelo-3d', 'figure'),
     State('camera-state-store', 'data'),
     State('stl-components-store', 'data')],
    prevent_initial_call=True,
    allow_duplicate=True  # Añadir esta línea
)
def actualizar_panel_pieza(pieza_seleccionada, nueva_direccion, nueva_prioridad, nueva_ayuda,
                           guardar_clicks, toggle_clicks, click_data,
                           relayout_data, config_data, current_piece,
                           current_figure, stored_camera, stl_components_data):
    # Si no hay componentes cargados, no hacer nada
    if not stl_components_data:
        return dash.no_update

    # Cargar componentes
    componentes_vertices = json.loads(stl_components_data)
    componentes = [
        trimesh.Trimesh(vertices=np.array(comp_vertices))
        for comp_vertices in componentes_vertices
    ]

    ctx = callback_context
    trigger = ctx.triggered[0]['prop_id'].split('.')[0] if ctx.triggered else None

    # Determine camera state
    if trigger == 'modelo-3d' and relayout_data and 'scene.camera' in relayout_data:
        current_camera = relayout_data['scene.camera']
    else:
        # Use stored or default camera
        current_camera = stored_camera or {
            'up': {'x': 0, 'y': 1, 'z': 0},
            'center': {'x': 0, 'y': 0, 'z': 0},
            'eye': {'x': 1.5, 'y': 1.5, 'z': 1.5}
        }

    # Load current configuration
    configuracion = json.loads(config_data) if config_data else None

    if not configuracion:
        configuracion = [
            {
                'id': i,
                'direccion': 'de abajo hacia arriba',
                'prioridad': i,
                'habilitado': True,
                'color': colores[i % len(colores)],
                'coordenadas_finales': {
                    'x': componente.vertices[:, 0].tolist(),
                    'y': componente.vertices[:, 1].tolist(),
                    'z': componente.vertices[:, 2].tolist(),
                    'rotacion_x': 0,
                    'rotacion_y': 0,
                    'rotacion_z': 0
                },
                'ayuda': ''
            } for i, componente in enumerate(componentes)
        ]

    # Logic to select piece based on click
    if trigger == 'modelo-3d' and click_data:
        try:
            trace_name = click_data['points'][0]['curveNumber']
            pieza_seleccionada = trace_name
        except (KeyError, IndexError, ValueError):
            pieza_seleccionada = 0

    # Default piece selection
    if pieza_seleccionada is None:
        pieza_seleccionada = current_piece or 0

    # Get selected piece configuration
    pieza = configuracion[pieza_seleccionada]

    # Set default values
    if nueva_direccion is None:
        nueva_direccion = pieza.get('direccion', direcciones[0])

    # Always set priority to piece ID
    nueva_prioridad = nueva_prioridad if nueva_prioridad is not None else pieza.get('prioridad', pieza['id'])

    pieza['prioridad'] = nueva_prioridad

    # Toggle piece visibility
    if trigger == 'toggle-pieza' and toggle_clicks:
        pieza['habilitado'] = not pieza.get('habilitado', True)
        configuracion[pieza_seleccionada] = pieza
        texto_modificado = f"*Pieza {pieza_seleccionada + 1} {'oculta' if not pieza['habilitado'] else 'visible'}"

    # Save configuration
    elif trigger == 'guardar-configuracion' and guardar_clicks:
        pieza_modificada = False

        # Update direction if changed
        if pieza['direccion'] != nueva_direccion:
            pieza['direccion'] = nueva_direccion
            pieza_modificada = True

        if pieza['prioridad'] != nueva_prioridad:
            pieza['prioridad'] = nueva_prioridad
            pieza_modificada = True

        texto_modificado = f"*Pieza {pieza_seleccionada + 1} modificada" if pieza_modificada else ''

        # Update global configuration
        configuracion[pieza_seleccionada] = pieza
    else:
        texto_modificado = ''

    # Create figure with new configuration, preserving camera
    nueva_figura = crear_figura(componentes, selected_piece=pieza_seleccionada, current_camera=current_camera)

    if nueva_ayuda is not None:
        pieza['ayuda'] = nueva_ayuda

    return (
        nueva_direccion,
        nueva_prioridad,
        nueva_ayuda,
        texto_modificado,
        json.dumps(configuracion),
        nueva_figura,
        pieza_seleccionada,
        current_camera
    )

# Callback to generate export JSON
@app.callback(
    Output("download-json", "data"),
    [Input('generar-json', 'n_clicks')],
    [State('configuracion-store', 'data'),
     State('stl-components-store', 'data')],
    prevent_initial_call=True,
    allow_duplicate=True
)
def generar_json(n_clicks, config_data, stl_components_data):
    try:
        if n_clicks and config_data and stl_components_data:
            # Cargar componentes
            componentes_vertices = json.loads(stl_components_data)
            componentes = [
                trimesh.Trimesh(vertices=np.array(comp_vertices))
                for comp_vertices in componentes_vertices
            ]

            config = json.loads(config_data)

            # Calculate model's bounding box
            all_vertices = np.concatenate([comp.vertices for comp in componentes])
            bbox_min = np.min(all_vertices, axis=0)
            bbox_max = np.max(all_vertices, axis=0)
            model_dimensions = bbox_max - bbox_min

            configuracion_unity = {
                "scene_configuration": {
                    "total_pieces": len(componentes),
                    "pieces": []
                }
            }

            for pieza in config:
                piece_config = {
                    "id": pieza["id"],
                    "direction": pieza.get('direccion', 'de abajo hacia arriba'),
                    "position": {
                        "x": componentes[pieza['id']].vertices[:, 0].tolist(),
                        "y": componentes[pieza['id']].vertices[:, 1].tolist(),
                        "z": componentes[pieza['id']].vertices[:, 2].tolist()
                    },
                    "rotation": {
                        "x": pieza['coordenadas_finales']['rotacion_x'],
                        "y": pieza['coordenadas_finales']['rotacion_y'],
                        "z": pieza['coordenadas_finales']['rotacion_z']
                    },
                    "color": pieza["color"],
                    "enabled": pieza["habilitado"],
                    "mesh": {
                        "vertices": componentes[pieza['id']].vertices.tolist(),
                        "faces": componentes[pieza['id']].faces.tolist()
                    },
                    "priority": pieza['prioridad'],
                    "help_text": pieza.get('ayuda', ''),
                }
                configuracion_unity["scene_configuration"]["pieces"].append(piece_config)

            # Convert configuration to JSON
            json_str = json.dumps(configuracion_unity, separators=(',', ':'), ensure_ascii=False)
            return dict(content=json_str, filename="configuracion_unity.json")
    except Exception as e:
        print(f"Error generating JSON: {e}")
    return dash.no_update

# Stylesheets
app.layout.className = 'container'

# Main
if __name__ == '__main__':
    app.run_server(host='0.0.0.0', debug=True, port=8050)
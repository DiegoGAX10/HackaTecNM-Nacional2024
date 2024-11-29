import dash
from dash import dcc, html, Input, Output, State
import plotly.graph_objects as go
import trimesh
import json
import numpy as np
from firebase_admin import firestore

from utils.FirebaseAppSingleton import FirebaseAppSingleton

# Simulated preconfigured model data
PRECONFIGURED_MODEL_PATH = 'HACKATHON.1_AllCATPart.stl'

# Colors for pieces
colores = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FDCB6E',
    '#6C5CE7', '#A8E6CF', '#FF8ED4', '#FAD390',
    '#55E6C1', '#5F27CD', '#48DBFB', '#FF6B6B'
]

# Directions for piece placement
direcciones = ['de abajo hacia arriba', 'de derecha a izquierda', 'de izquierda a derecha', 'de arriba hacia abajo']

def load_preconfigured_model():
    """Load a preconfigured STL model for demonstration"""
    try:
        # Replace this with your actual preconfigured model loading logic
        mesh = trimesh.load_mesh(PRECONFIGURED_MODEL_PATH)
        componentes = mesh.split()
        return componentes
    except Exception as e:
        print(f"Error loading preconfigured model: {e}")
        return None

def crear_figura(componentes, selected_piece=None, current_camera=None):
    """Create 3D visualization figure"""
    if not componentes:
        return go.Figure()

    fig = go.Figure()

    for idx, componente in enumerate(componentes):
        x = componente.vertices[:, 0]
        y = componente.vertices[:, 1]
        z = componente.vertices[:, 2]

        mesh = go.Mesh3d(
            x=x,
            y=y,
            z=z,
            i=componente.faces[:, 0],
            j=componente.faces[:, 1],
            k=componente.faces[:, 2],
            color=colores[idx % len(colores)],
            opacity=0.7 if selected_piece is not None and idx != selected_piece else 1.0,
            name=f'Piece {idx}'
        )

        fig.add_trace(mesh)

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
    for idx, componente in enumerate(componentes):
        mesh = go.Mesh3d(
            # ... otros parámetros existentes
            opacity=0.7 if selected_piece is not None and idx != selected_piece else 1.0,
        )

    return fig

# Create Dash app
app = dash.Dash(__name__, suppress_callback_exceptions=True)

# Application layout with simulated upload
# Professional Color Palette
COLORS = {
    'primary': '#3498db',     # Soft Blue
    'secondary': '#2ecc71',   # Emerald Green
    'background': '#f5f5f5',  # Light Gray
    'text': '#2c3e50',        # Dark Blue-Gray
    'accent': '#e74c3c'       # Soft Red
}

# Updated Google Fonts import and styling
app.layout = html.Div(style={
    'fontFamily': 'Inter, sans-serif',
    'backgroundColor': COLORS['background'],
    'color': COLORS['text']
}, children=[
        html.Div(id='upload-simulation-container', children=[
            html.H1(
                "3D Model Reconstruction",
                style={
                    'textAlign': 'center',
                    'color': COLORS['primary'],
                    'fontWeight': '600',
                    'marginBottom': '30px'
                }
            ),
            html.Div(id='upload-overlay', style={
                'position': 'fixed',
                'top': '0',
                'left': '0',
                'width': '100%',
                'height': '100%',
                'backgroundColor': 'rgba(0,0,0,0.6)',
                'display': 'flex',
                'justifyContent': 'center',
                'alignItems': 'center',
                'zIndex': '1000'
            }, children=[
                html.Div(style={
                    'backgroundColor': 'white',
                    'padding': '40px',
                    'borderRadius': '15px',
                    'boxShadow': '0 10px 25px rgba(0,0,0,0.1)',
                    'textAlign': 'center',
                    'maxWidth': '500px',
                    'width': '100%'
                }, children=[
                    html.H2(
                        "Select Your Model",
                        style={
                            'color': COLORS['text'],
                            'marginBottom': '20px',
                            'fontWeight': '600'
                        }
                    ),
                    dcc.Loading(
                        id="loading-simulation",
                        type="circle",
                        children=[html.Div(id='loading-output')]
                    )
                ])
            ])
        ]),

        # Main model page (initially hidden)
        html.Div(id='modelo-page', style={'display': 'none', 'padding': '20px'}, children=[
            html.H1(
                "Interactive 3D Model Reconstruction",
                style={
                    'textAlign': 'center',
                    'color': COLORS['primary'],
                    'fontWeight': '600',
                    'marginBottom': '30px'
                }
            ),
            dcc.Store(id='camera-state-store', data=None),
            html.Div(id='modelo-3d-container', style={'boxShadow': '0 5px 15px rgba(0,0,0,0.1)'}, children=[
                dcc.Graph(
                    id='modelo-3d',
                    figure=go.Figure(),
                    style={'height': '600px'},
                    config={'displayModeBar': True, 'scrollZoom': True}
                )
            ]),

            # Configuration Panel with Modern Styling
            html.Div([
                html.H3(
                    "Piece Configuration",
                    style={
                        'color': COLORS['text'],
                        'fontWeight': '600',
                        'borderBottom': f'2px solid {COLORS["primary"]}',
                        'paddingBottom': '10px'
                    }
                ),
                dcc.Dropdown(
                    id='dropdown-pieza',
                    options=[],
                    value=None,
                    placeholder='Select Piece',
                    style={
                        'width': '100%',
                        'marginBottom': '20px',
                        'borderRadius': '8px'
                    }
                ),
                html.Div([
                    html.Label('Direction', style={'fontWeight': '500', 'color': COLORS['text']}),
                    dcc.Dropdown(
                        id='direccion-pieza',
                        options=[{'label': direccion, 'value': direccion} for direccion in direcciones],
                        value=None,
                        placeholder='Select Direction',
                        style={
                            'width': '100%',
                            'marginBottom': '20px',
                            'borderRadius': '8px'
                        }
                    ),
                    html.Label('Priority', style={'fontWeight': '500', 'color': COLORS['text']}),
                    dcc.Input(
                        id='prioridad-pieza',
                        type='number',
                        placeholder='Enter Priority',
                        style={
                            'width': '100%',
                            'marginBottom': '20px',
                            'borderRadius': '8px',
                            'border': f'1px solid {COLORS["primary"]}',
                            'padding': '10px'
                        }
                    ),
                    html.Div(id='texto-modificado', style={'color': COLORS['secondary'], 'marginBottom': '15px'}),

                    html.Label('Help Text', style={'fontWeight': '500', 'color': COLORS['text'], 'marginTop': '20px'}),
                    dcc.Textarea(
                        id='ayuda-pieza',
                        placeholder='Write a note or warning about this piece...',
                        style={
                            'width': '100%',
                            'height': 100,
                            'marginBottom': '20px',
                            'borderRadius': '8px',
                            'border': f'1px solid {COLORS["primary"]}',
                            'padding': '10px'
                        }
                    ),
                    html.Button(
                        'Save Configuration',
                        id='guardar-configuracion',
                        style={
                            'width': '100%',
                            'padding': '12px',
                            'backgroundColor': COLORS['primary'],
                            'color': 'white',
                            'border': 'none',
                            'borderRadius': '8px',
                            'fontWeight': '600',
                            'transition': 'background-color 0.3s ease',
                            'cursor': 'pointer'
                        },
                        n_clicks=0
                    ),
                ], style={
                    'backgroundColor': 'white',
                    'padding': '25px',
                    'borderRadius': '12px',
                    'boxShadow': '0 5px 15px rgba(0,0,0,0.1)'
                })
            ], style={'maxWidth': '600px', 'margin': '30px auto'}),

            # JSON Export Button with Modern Styling
            html.Div(
                html.Button(
                    "Generate Unity JSON",
                    id='generar-json',
                    style={
                        'width': '250px',
                        'padding': '12px',
                        'backgroundColor': COLORS['secondary'],
                        'color': 'white',
                        'border': 'none',
                        'borderRadius': '8px',
                        'fontWeight': '600',
                        'transition': 'background-color 0.3s ease',
                        'cursor': 'pointer',
                        'margin': '20px auto',
                        'display': 'block'
                    }
                ),
                style={'textAlign': 'center'}
            ),
            dcc.Store(id='stl-components-store'),
            dcc.Store(id='pieza-seleccionada-store', data=None),
            dcc.Store(id='configuracion-store', data=None),
            dcc.Download(id="download-json"),

            html.Div(
                html.Img(
                    id='qr-image',
                    src='assets/qr.jpeg',  # Reemplaza con la ruta de tu imagen de QR
                    style={
                        'maxWidth': '200px',
                        'display': 'block',
                        'margin': '20px auto'
                    }
                ),
                style={'textAlign': 'center'}
            ),

            html.Button(
                "Download QR Code",
                id='download-qr-button',
                style={
                    'width': '250px',
                    'padding': '12px',
                    'backgroundColor': COLORS['secondary'],
                    'color': 'white',
                    'border': 'none',
                    'borderRadius': '8px',
                    'fontWeight': '600',
                    'cursor': 'pointer',
                    'margin': '20px auto',
                    'display': 'block'
                }
            ),
            dcc.Download(id="download-qr-file"),

        ])
    ])

from dash.dcc import send_file

@app.callback(
    Output("download-qr-file", "data"),
    [Input("download-qr-button", "n_clicks")],
    prevent_initial_call=True
)
def descargar_qr(n_clicks):
    # Ruta del archivo QR
    qr_path = "assets/qr.jpeg"  # Cambia la ruta si es necesario

    # Usar send_file para enviar el archivo como respuesta
    return send_file(qr_path)


@app.callback(
    Output('qr-image', 'style'),
    [Input('generar-json', 'n_clicks')]
)
def mostrar_qr(n_clicks):
    if n_clicks and n_clicks > 0:
        return {
            'maxWidth': '200px',
            'display': 'block',
            'margin': '20px auto'
        }
    return {'display': 'none'}

@app.callback(
    [Output('upload-simulation-container', 'style'),
     Output('modelo-page', 'style'),
     Output('modelo-3d', 'figure'),
     Output('dropdown-pieza', 'options')],
    [Input('loading-output', 'children')],
    prevent_initial_call=True
)
def simular_carga_modelo(dummy):
    # Load preconfigured model
    componentes = load_preconfigured_model()

    if componentes:
        # Create figure
        figura = crear_figura(componentes)

        # Create piece dropdown options
        piece_options = [{'label': f'Pieza {i + 1}', 'value': i} for i in range(len(componentes))]

        return (
            {'display': 'none'},  # Hide upload simulation
            {'display': 'block'},  # Show model page
            figura,
            piece_options
        )

    # Fallback if model loading fails
    return (
        {'display': 'block'},
        {'display': 'none'},
        go.Figure(),
        []
    )

# Dummy callback to simulate loading
@app.callback(
    Output('loading-output', 'children'),
    [Input('upload-overlay', 'n_clicks')],
    prevent_initial_call=True
)
def simulate_loading(n_clicks):
    # Simulating some loading process
    import time
    time.sleep(2)  # Simulate a 2-second loading time
    return "Modelo cargado"
@app.callback(
    [Output('pieza-seleccionada-store', 'data'),
     Output('dropdown-pieza', 'value'),
     Output('direccion-pieza', 'value'),
     Output('prioridad-pieza', 'value'),
     Output('ayuda-pieza', 'value')],
    [Input('modelo-3d', 'clickData')],
    [State('dropdown-pieza', 'options')]
)
def seleccionar_pieza(clickData, piece_options):
    if not clickData:
        return None, None, None, None, ''

    # Obtener el índice de la pieza seleccionada
    punto_seleccionado = clickData['points'][0]
    indice_pieza = punto_seleccionado.get('curveNumber', None)

    if indice_pieza is not None:
        # Configurar los valores de los campos basados en la pieza seleccionada
        return (
            indice_pieza,  # Guardar en store
            indice_pieza,  # Valor del dropdown
            direcciones[indice_pieza % len(direcciones)],  # Dirección por defecto
            indice_pieza,  # Prioridad inicial
            f'Configuración para Pieza {indice_pieza + 1}'  # Texto de ayuda inicial
        )

    return None, None, None, None, ''

@app.callback(
    [Output('configuracion-store', 'data'),
     Output('texto-modificado', 'children')],
    [Input('guardar-configuracion', 'n_clicks')],
    [State('pieza-seleccionada-store', 'data'),
     State('direccion-pieza', 'value'),
     State('prioridad-pieza', 'value'),
     State('ayuda-pieza', 'value')]
)
def guardar_configuracion(n_clicks, pieza_seleccionada, direccion, prioridad, ayuda):
    if not n_clicks or pieza_seleccionada is None:
        return None, ''

    configuracion = {
        'pieza': pieza_seleccionada,
        'direccion': direccion,
        'prioridad': prioridad,
        'ayuda': ayuda
    }

    return configuracion, f'Configuración guardada para Pieza {pieza_seleccionada + 1}'


# Callback to generate export JSON
@app.callback(
    Output("download-json", "data"),
    [Input('generar-json', 'n_clicks')],
    [State('configuracion-store', 'data'),
     State('stl-components-store', 'data')],
    prevent_initial_call=True,
    allow_duplicate=True
)
#Samuel
def generar_json(n_clicks, config_data, stl_components_data):
    # try:
    #     if n_clicks and config_data and stl_components_data:
    #         # Cargar componentes
    #         componentes_vertices = json.loads(stl_components_data)
    #         componentes = [
    #             trimesh.Trimesh(vertices=np.array(comp_vertices))
    #             for comp_vertices in componentes_vertices
    #         ]
    #
    #         config = json.loads(config_data)
    #
    #         # Calcular dimensiones del modelo
    #         all_vertices = np.concatenate([comp.vertices for comp in componentes])
    #         bbox_min = np.min(all_vertices, axis=0)
    #         bbox_max = np.max(all_vertices, axis=0)
    #         model_dimensions = bbox_max - bbox_min
    #
    #         configuracion_unity = {
    #             "scene_configuration": {
    #                 "total_pieces": len(componentes),
    #                 "pieces": []
    #             }
    #         }
    #
    #         for pieza in config:
    #             piece_config = {
    #                 "id": pieza["id"],
    #                 "direction": pieza.get('direccion', 'de abajo hacia arriba'),
    #                 "position": {
    #                     "x": componentes[pieza['id']].vertices[:, 0].tolist(),
    #                     "y": componentes[pieza['id']].vertices[:, 1].tolist(),
    #                     "z": componentes[pieza['id']].vertices[:, 2].tolist()
    #                 },
    #                 "rotation": {
    #                     "x": pieza['coordenadas_finales']['rotacion_x'],
    #                     "y": pieza['coordenadas_finales']['rotacion_y'],
    #                     "z": pieza['coordenadas_finales']['rotacion_z']
    #                 },
    #                 "color": pieza["color"],
    #                 "enabled": pieza["habilitado"],
    #                 "mesh": {
    #                     "vertices": componentes[pieza['id']].vertices.tolist(),
    #                     "faces": componentes[pieza['id']].faces.tolist()
    #                 },
    #                 "priority": pieza['prioridad'],
    #                 "help_text": pieza.get('ayuda', ''),
    #             }
    #             configuracion_unity["scene_configuration"]["pieces"].append(piece_config)
    #
    #         # Convertir configuración a JSON
    #         json_str = json.dumps(configuracion_unity, separators=(',', ':'), ensure_ascii=False)
    #
    #         # Guardar en Firebase
    #         firebase_instance = FirebaseAppSingleton()
    #         db = firestore.client(app=firebase_instance.app)
    #         db.collection("3DModels").add({
    #             "model": configuracion_unity
    #         })
    #
    #
    #     return dict(content=json_str, filename="configuracion_unity.json")
    # except Exception as e:
    #     import logging
    #     logging.error(f"Error generating JSON: {e}")
    return None


# Main
if __name__ == '__main__':
    app.run_server(host='0.0.0.0', debug=True, port=8050)
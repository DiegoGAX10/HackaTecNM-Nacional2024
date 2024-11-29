import dash
from dash import dcc, html, Input, Output, State
import plotly.graph_objs as go
import numpy as np
import json
import os

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    rgb = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    return rgb

class ModeloGenerador:
    def __init__(self, json_data):
        # Parsear JSON y ordenar piezas por prioridad
        config_data = json.loads(json_data)
        self.piezas_originales = sorted(
            config_data['scene_configuration']['pieces'],
            key=lambda x: x.get('prioridad', float('inf'))
        )
        self.piezas = self.piezas_originales.copy()
        self.piezas_generadas = []
        self.indice_actual = -1

    def generar_siguiente_pieza(self):
        if self.indice_actual < len(self.piezas_originales) - 1:
            self.indice_actual += 1
            pieza = self.piezas_originales[self.indice_actual]
            self.piezas_generadas.append(pieza)
            return self._reconstruir_modelo_parcial()
        return None, None

    def generar_pieza_anterior(self):
        if self.indice_actual > 0:
            pieza_removida = self.piezas_generadas.pop()
            self.indice_actual -= 1
            return self._reconstruir_modelo_parcial()
        return None, None

    def generar_modelo_completo(self):
        # Resetear y generar todas las piezas
        self.piezas_generadas = self.piezas_originales.copy()
        self.indice_actual = len(self.piezas_originales) - 1
        return self._reconstruir_modelo_parcial()

    def _reconstruir_modelo_parcial(self):
        x_all, y_all, z_all = [], [], []
        colores = []
        i_all, j_all, k_all = [], [], []
        vertex_offset = 0

        for idx, pieza in enumerate(self.piezas_generadas):
            vertices = np.array(pieza['mesh']['vertices'])
            faces = np.array(pieza['mesh']['faces'])

            x_all.extend(vertices[:, 0])
            y_all.extend(vertices[:, 1])
            z_all.extend(vertices[:, 2])

            color = pieza['color']
            rgb_color = hex_to_rgb(color)
            rgb_normalized = [c / 255.0 for c in rgb_color]

            num_faces = len(faces)

            # Fade in effect: disminuir opacidad para piezas más antiguas
            opacidad = min(0.9, 0.3 + (idx / len(self.piezas_generadas)) * 0.6)

            colores.extend([rgb_normalized] * num_faces)

            for cara in faces:
                i_all.append(cara[0] + vertex_offset)
                j_all.append(cara[1] + vertex_offset)
                k_all.append(cara[2] + vertex_offset)

            vertex_offset += len(vertices)

        return x_all, y_all, z_all, colores, i_all, j_all, k_all

def cargar_json_desde_archivo(ruta_archivo):
    with open(ruta_archivo, 'r') as archivo:
        return archivo.read()

# Ruta del archivo JSON
json_file_path = 'configuracion_unity25.json'
json_data = cargar_json_desde_archivo(json_file_path)
modelo_generador = ModeloGenerador(json_data)

# Inicializar la aplicación Dash
app = dash.Dash(__name__, external_stylesheets=[
    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css'
])

# Diseño de la aplicación
app.layout = html.Div([
    # Encabezado con gradiente
    html.Div([
        html.Div([
            # Botón de retroceso
            html.Button([
                html.I(className="fas fa-arrow-left", style={'color': 'white', 'fontSize': 24}),
            ], id='btn-regresar', style={
                'background': 'none',
                'border': 'none',
                'padding': '10px'
            }),

            # Título centrado
            html.H1("Generador de Modelo 3D", style={
                'color': 'white',
                'fontSize': '1.5rem',
                'fontWeight': 'bold',
                'margin': '0 auto',
                'position': 'absolute',
                'left': '50%',
                'transform': 'translateX(-50%)'
            }),
        ], style={
            'display': 'flex',
            'alignItems': 'center',
            'position': 'relative',
            'background': 'linear-gradient(to right, #1a237e, #0d47a1)',
            'padding': '15px',
            'paddingTop': '40px'
        })
    ]),

    # Contenedor principal
    html.Div([
        html.Div([
            # Controles de navegación
            html.Div([
                html.Div([
                    html.Button('⬅️ Anterior',
                                id='btn-pieza-anterior',
                                n_clicks=0,
                                className='btn btn-light w-100 mb-2',
                                style={'fontSize': '0.9rem'}),
                    html.Button('Siguiente ➡️',
                                id='btn-pieza-siguiente',
                                n_clicks=0,
                                className='btn btn-light w-100 mb-2',
                                style={'fontSize': '0.9rem'}),
                    html.Button('🔄 Modelo Completo',
                                id='btn-modelo-completo',
                                n_clicks=0,
                                className='btn btn-primary w-100',
                                style={'fontSize': '0.9rem'})
                ], className='d-grid gap-2')
            ], className='card p-3 mb-3 shadow-sm'),

            # Contador de piezas
            html.Div(
                id='contador-piezas',
                className='text-center alert alert-info',
                children='Piezas generadas: 0',
                style={'fontSize': '0.9rem'}
            ),


            # Gráfica 3D
            html.Div([
                dcc.Graph(
                    id='grafica-3d',
                    config={'responsive': True},
                    style={'height': '50vh'}
                )
            ], className='card p-2 shadow-sm')
        ], className='container')
    ], style={'backgroundColor': '#f8f9fa', 'minHeight': '100vh', 'padding': '20px'}),

    html.Div([
        html.Div([
            html.H4("Notas del Modelo", className='card-header'),
            html.Div(id='notas-modelo', className='card-body')
        ], className='card mb-3')
    ], className='container')
])

@app.callback(
    Output('notas-modelo', 'children'),
    [Input('btn-pieza-siguiente', 'n_clicks'),
     Input('btn-pieza-anterior', 'n_clicks'),
     Input('btn-modelo-completo', 'n_clicks')]
)
def actualizar_notas(n_siguiente, n_anterior, n_completo):
    # Cargar notas desde el archivo de texto
    notas = cargar_notas_desde_txt()

    # Convertir notas a lista de elementos HTML
    nota_elementos = [
        html.P(nota, className='mb-2') for nota in notas
    ]

    return nota_elementos
# Callback para actualizar el modelo 3D
@app.callback(
    [Output('grafica-3d', 'figure'),
     Output('contador-piezas', 'children')],
    [Input('btn-pieza-siguiente', 'n_clicks'),
     Input('btn-pieza-anterior', 'n_clicks'),
     Input('btn-modelo-completo', 'n_clicks')]
)
def actualizar_modelo(n_siguiente, n_anterior, n_completo):
    ctx = dash.callback_context

    if not ctx.triggered:
        return dash.no_update, "Piezas generadas: 0"

    boton_presionado = ctx.triggered[0]['prop_id'].split('.')[0]

    if boton_presionado == 'btn-pieza-siguiente':
        resultado = modelo_generador.generar_siguiente_pieza()
        mensaje = f"Piezas generadas (Adelante): {modelo_generador.indice_actual + 1}"
    elif boton_presionado == 'btn-pieza-anterior':
        resultado = modelo_generador.generar_pieza_anterior()
        mensaje = f"Piezas generadas (Atrás): {modelo_generador.indice_actual + 1}"
    elif boton_presionado == 'btn-modelo-completo':
        resultado = modelo_generador.generar_modelo_completo()
        mensaje = "Modelo completo generado"

    if resultado is None:
        return dash.no_update, mensaje

    x_all, y_all, z_all, colores, i_all, j_all, k_all = resultado

    fig = go.Figure(
        data=[go.Mesh3d(
            x=x_all,
            y=y_all,
            z=z_all,
            i=i_all,
            j=j_all,
            k=k_all,
            facecolor=colores,
            opacity=0.7,
            showscale=True
        )]
    )

    fig.update_layout(
        scene=dict(
            xaxis=dict(showgrid=False, showticklabels=False, showline=False, title=''),
            yaxis=dict(showgrid=False, showticklabels=False, showline=False, title=''),
            zaxis=dict(showgrid=False, showticklabels=False, showline=False, title=''),
            bgcolor='white'
        ),
        margin=dict(l=0, r=0, b=0, t=0),
        autosize=True,
        paper_bgcolor='white',
        plot_bgcolor='white',
        showlegend=False,
    )

    return fig, mensaje

def cargar_json_desde_archivo(ruta_archivo):
    with open(ruta_archivo, 'r') as archivo:
        return archivo.read()

# Nueva función para cargar notas desde un archivo .txt
def cargar_notas_desde_txt(ruta_archivo='analisis_piezas_con_notas.txt'):
    if os.path.exists(ruta_archivo):
        with open(ruta_archivo, 'r', encoding='utf-8') as archivo:
            # Leer cada línea como una nota
            notas = archivo.readlines()
        return [linea.strip() for linea in notas if linea.strip()]
    else:
        # Si no existe, retornar notas predeterminadas
        return ["Nota predeterminada 1.", "Nota predeterminada 2."]

# Callback para el botón de retroceso (opcional)
@app.callback(
    Output('btn-regresar', 'n_clicks'),
    [Input('btn-regresar', 'n_clicks')]
)
def regresar_a_main(n_clicks):
    # Puedes personalizar la lógica de retroceso aquí
    if n_clicks and n_clicks > 0:
        print("Botón de retroceso presionado")
        return 0
    return 0

if __name__ == '__main__':
    app.run_server(debug=True, host='10.186.8.85', port=8050)
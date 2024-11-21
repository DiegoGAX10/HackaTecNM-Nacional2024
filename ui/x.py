import dash
from dash import dcc, html, Input, Output, State
import plotly.graph_objs as go
import numpy as np
import json
import time

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

app = dash.Dash(__name__, external_stylesheets=[
    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css'
])

# Configuración meta para mejorar la vista en móviles
app.index_string = '''
<!DOCTYPE html>
<html>
    <head>
        {%metas%}
        <title>{%title%}</title>
        {%favicon%}
        {%css%}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <style>
            body {
                touch-action: manipulation;  /* Prevenir doble tap zoom */
            }
            .btn-mobile {
                font-size: 14px;
                padding: 8px 12px;
                margin: 5px;
            }
            @media (max-width: 600px) {
                .container {
                    padding: 10px;
                }
                #grafica-3d {
                    height: 400px;  /* Altura fija para móviles */
                }
            }
        </style>
    </head>
    <body>
        {%app_entry%}
        <footer>
            {%config%}
            {%scripts%}
            {%renderer%}
        </footer>
    </body>
</html>
'''

app.layout = html.Div([
    html.Div([
        html.H1("Modelo 3D", className="text-center mb-4"),
        html.Div([
            html.Button('⬅️ Anterior',
                        id='btn-pieza-anterior',
                        n_clicks=0,
                        className='btn btn-primary btn-mobile'),
            html.Button('Siguiente ➡️',
                        id='btn-pieza-siguiente',
                        n_clicks=0,
                        className='btn btn-primary btn-mobile'),
            html.Button('🔄 Modelo Completo',
                        id='btn-modelo-completo',
                        n_clicks=0,
                        className='btn btn-success btn-mobile')
        ], className="d-flex justify-content-center mb-3"),
        html.Div(id='contador-piezas',
                 children='Piezas generadas: 0',
                 className="text-center mb-3"),
        dcc.Graph(
            id='grafica-3d',
            config={'responsive': True},  # Hace que la gráfica sea responsiva
            figure={
                'layout': {
                    'title': "Modelo 3D",
                    'scene': {
                        'xaxis_title': 'X',
                        'yaxis_title': 'Y',
                        'zaxis_title': 'Z'
                    }
                }
            },
            style={'height': '70vh'}  # Altura relativa al viewport
        )
    ], className="container")
], style={'touchAction': 'manipulation'})

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
        paper_bgcolor='white',  # Fondo transparente
        plot_bgcolor='white',  # Fondo transparente
        showlegend=False,
    )

    return fig, mensaje

if __name__ == '__main__':
    app.run_server(debug=True, host='172.20.10.2', port=8050)
import dash
from dash import dcc, html
import plotly.graph_objs as go
import numpy as np
import json

# Función para convertir un color hexadecimal a un valor RGB
def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    rgb = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    return rgb

# Crear la aplicación Dash
app = dash.Dash(__name__)

# Esta función reconstruye las piezas del modelo 3D a partir del JSON
def reconstruir_modelo_desde_json(json_data):
    # Parsear el JSON de configuración
    config_data = json.loads(json_data)
    piezas = config_data['scene_configuration']['pieces']

    # Inicializar listas para las coordenadas de los puntos 3D
    x_all = []
    y_all = []
    z_all = []
    colores = []
    i_all = []
    j_all = []
    k_all = []

    # Inicializar el índice para los vértices globales
    vertex_offset = 0

    for pieza in piezas:
        # Obtener los datos de la pieza
        vertices = np.array(pieza['mesh']['vertices'])
        faces = np.array(pieza['mesh']['faces'])

        # Aplicar la traslación a los vértices
        x_all.extend(vertices[:, 0])
        y_all.extend(vertices[:, 1])
        z_all.extend(vertices[:, 2])

        # Convertir color hexadecimal a RGB
        color = pieza['color']
        rgb_color = hex_to_rgb(color)
        rgb_normalized = [c / 255.0 for c in rgb_color]

        # Asignar el color a todas las caras de esta pieza
        num_faces = len(faces)
        colores.extend([rgb_normalized] * num_faces)

        # Asegurarnos de que las caras se agreguen correctamente con los índices
        for cara in faces:
            i_all.append(cara[0] + vertex_offset)
            j_all.append(cara[1] + vertex_offset)
            k_all.append(cara[2] + vertex_offset)

        # Actualizar el offset de vértices para la siguiente pieza
        vertex_offset += len(vertices)

    return x_all, y_all, z_all, colores, i_all, j_all, k_all

# Cargar el JSON desde un archivo
def cargar_json_desde_archivo(ruta_archivo):
    with open(ruta_archivo, 'r') as archivo:
        return archivo.read()

# Ruta del archivo JSON (ajústalo según tu archivo)
json_file_path = 'configuracion_unity25.json'

# Leer el archivo JSON
json_data = cargar_json_desde_archivo(json_file_path)

# Reconstruir el modelo 3D a partir del JSON
x_all, y_all, z_all, colores, i_all, j_all, k_all = reconstruir_modelo_desde_json(json_data)

# Crear la figura en Plotly
fig = go.Figure(
    data=[go.Mesh3d(
        x=x_all,
        y=y_all,
        z=z_all,
        i=i_all,
        j=j_all,
        k=k_all,
        facecolor=colores,  # Usamos facecolor con la lista de colores RGB
        opacity=0.5,
        showscale=False  # Si prefieres no mostrar la escala de colores
    )]
)

# Configurar el layout de la gráfica 3D
fig.update_layout(
    title="Modelo 3D desde JSON",
    scene=dict(
        xaxis_title='X',
        yaxis_title='Y',
        zaxis_title='Z'
    ),
    margin=dict(l=0, r=0, b=0, t=40)
)

# Definir el layout de la aplicación Dash
app.layout = html.Div([
    html.H1("Modelo 3D con Plotly y Dash"),
    dcc.Graph(figure=fig)
])

# Ejecutar la aplicación Dash
if __name__ == '__main__':
    app.run_server(debug=True)

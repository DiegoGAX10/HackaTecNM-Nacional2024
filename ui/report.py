import json
from openai import OpenAI
from Config import Config

# Cargar el archivo JSON
with open('configuracion_unity25.json', 'r') as file:
    data = json.load(file)

# Configurar el cliente de OpenAI
client = OpenAI(api_key=Config.OPEN_AI)


def filtrar_piezas_con_notas(data):
    """
    Filtra las piezas que tienen notas
    """
    piezas_con_notas = []

    for piece in data["scene_configuration"]["pieces"]:
        # Verificar si hay notas y no están vacías
        if piece.get("help_text") and piece["help_text"].strip():
            piezas_con_notas.append(piece)

    return piezas_con_notas


def analizar_piezas_con_notas(piezas_con_notas):
    """
    Analiza las piezas que tienen notas
    """
    # Preparar un resumen de las piezas con notas
    resumen_piezas = []
    for piece in piezas_con_notas:
        resumen_piece = {
            "priority": piece.get("priority"),
            "direction": piece.get("direction"),
            "help_text": piece.get("help_text", "")
        }
        resumen_piezas.append(resumen_piece)

    prompt = f"""
    Dado un conjunto de datos en formato JSON sobre piezas de una configuración, genera un resumen detallado para cada pieza en texto continuo, incluyendo: La prioridad de la pieza. 
        1. La dirección indicada en la pieza.
        2. El texto debe estar redactado en un formato continuo y profesional.

    Piezas con notas: {json.dumps(resumen_piezas, indent=2)}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un experto en análisis de componentes y ensamblaje industrial."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=3000
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error al analizar piezas con notas: {str(e)}"


# Filtrar piezas con notas
piezas_con_notas = filtrar_piezas_con_notas(data)

# Verificar si hay piezas con notas
if piezas_con_notas:
    # Analizar piezas con notas
    analisis_piezas = analizar_piezas_con_notas(piezas_con_notas)

    # Guardar análisis en archivo
    with open('analisis_piezas_con_notas.txt', 'w') as file:
        file.write(analisis_piezas)

    # Imprimir cantidad de piezas con notas
    print(f"Número de piezas con notas: {len(piezas_con_notas)}")

    # Imprimir análisis
    print("\nAnálisis de Piezas con Notas:")
    print(analisis_piezas)
else:
    print("No se encontraron piezas con notas en el JSON.")
import json

# Cargar el archivo JSON desde un archivo
with open('configuracion_unity25.json', 'r') as file:  # Asegúrate de usar el nombre correcto del archivo
    data = json.load(file)

# Procesar el JSON
pieces_info = []
for piece in data["scene_configuration"]["pieces"]:
    priority = piece.get("priority")
    direction = piece.get("direction")
    help_text = piece.get("help_text", "")  # Obtén el valor de help_text o usa una cadena vacía si no existe
    has_help_text = bool(help_text and help_text.strip())  # Verifica si tiene contenido válido
    pieces_info.append({
        "priority": priority,
        "direction": direction,
        "has_help_text": has_help_text
    })

# Mostrar la información procesada
for idx, piece in enumerate(pieces_info):
    print(f"Piece {idx}:")
    print(f"  Priority: {piece['priority']}")
    print(f"  Direction: {piece['direction']}")
    print(f"  Has Help Text: {piece['has_help_text']}")

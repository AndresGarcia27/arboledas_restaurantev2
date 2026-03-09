<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menú - Restaurante Arboleda's</title>
    <style>
        body { font-family: sans-serif; background-color: #f4f4f4; padding: 20px; }
        h1 { text-align: center; color: #333; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .categoria { color: #e67e22; font-weight: bold; text-transform: uppercase; font-size: 0.8em; }
        .nombre { font-size: 1.2em; margin: 10px 0; color: #2c3e50; }
        .precio { font-size: 1.5em; color: #27ae60; font-weight: bold; }
        .descripcion { color: #7f8c8d; font-style: italic; }
    </style>
</head>
<body>

    <h1>Restaurante Arboleda's</h1>
    <hr>

    <div class="grid">
        @foreach($productos as $plato)
            <div class="card">
                <span class="categoria">{{ $plato->categoria->nombre }}</span>
                <h2 class="nombre">{{ $plato->nombre }}</h2>
                <p class="descripcion">{{ $plato->descripcion }}</p>
                <div class="precio">${{ number_format($plato->precio, 0, ',', '.') }}</div>
            </div>
        @endforeach
        </div>

</body>
</html>
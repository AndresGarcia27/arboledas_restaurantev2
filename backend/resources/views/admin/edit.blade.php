<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar Plato</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="container mt-5">
    <h1>Editar: {{ $producto->nombre }}</h1>
    
    <form action="{{ route('admin.productos.update', $producto->producto_id) }}" method="POST">
        @csrf
        @method('PUT') <div class="mb-3">
            <label>Nombre del Plato:</label>
            <input type="text" name="nombre" class="form-control" value="{{ $producto->nombre }}" required>
        </div>

        <div class="mb-3">
            <label>Descripción:</label>
            <textarea name="descripcion" class="form-control">{{ $producto->descripcion }}</textarea>
        </div>

        <div class="mb-3">
            <label>Precio:</label>
            <input type="number" name="precio" class="form-control" value="{{ $producto->precio }}" required>
        </div>

        <div class="mb-3">
            <label>Categoría:</label>
            <select name="categoria_id" class="form-control">
                @foreach($categorias as $cat)
                    <option value="{{ $cat->categoria_id }}" {{ $producto->categoria_id == $cat->categoria_id ? 'selected' : '' }}>
                        {{ $cat->nombre }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="mb-3">
            <label>URL de Imagen:</label>
            <input type="text" name="imagen_url" class="form-control" value="{{ $producto->imagen_url }}">
        </div>

        <button type="submit" class="btn btn-primary">Actualizar Plato</button>
        <a href="{{ route('admin.productos.index') }}" class="btn btn-secondary">Cancelar</a>
    </form>
</body>
</html>
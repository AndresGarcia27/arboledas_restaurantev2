<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Crear Plato</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="container mt-5">
    <h1>Agregar Nuevo Plato</h1>
    
    <form action="{{ route('admin.productos.store') }}" method="POST">
        @csrf <div class="mb-3">
            <label>Nombre del Plato:</label>
            <input type="text" name="nombre" class="form-control" required>
        </div>

        <div class="mb-3">
            <label>Descripción:</label>
            <textarea name="descripcion" class="form-control"></textarea>
        </div>

        <div class="mb-3">
            <label>Precio:</label>
            <input type="number" name="precio" class="form-control" required>
        </div>

        <div class="mb-3">
            <label>Categoría:</label>
            <select name="categoria_id" class="form-control">
                @foreach($categorias as $cat)
                    <option value="{{ $cat->categoria_id }}">{{ $cat->nombre }}</option>
                @endforeach
            </select>
        </div>

        <div class="mb-3">
            <label>URL de Imagen (Ej: plato.jpg):</label>
            <input type="text" name="imagen_url" class="form-control">
        </div>

        <button type="submit" class="btn btn-success">Guardar Plato</button>
        <a href="{{ route('admin.productos.index') }}" class="btn btn-secondary">Cancelar</a>
    </form>
</body>
</html>
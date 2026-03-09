<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Administrar Menú</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="container mt-5">
    
    <h1 class="mb-4">Gestión de Platos - Arboleda's</h1>
    
    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <a href="{{ route('admin.productos.create') }}" class="btn btn-primary mb-3">＋ Nuevo Plato</a>

    <table class="table table-bordered table-hover">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach($productos as $producto)
            <tr>
                <td>{{ $producto->producto_id }}</td>
                <td>{{ $producto->nombre }}</td>
                <td>${{ number_format($producto->precio, 0) }}</td>
                <td>{{ $producto->categoria->nombre }}</td>
                <td>
                    <a href="{{ route('admin.productos.edit', $producto->producto_id) }}" class="btn btn-warning btn-sm">Editar</a>
                    
                    <form action="{{ route('admin.productos.destroy', $producto->producto_id) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('¿Seguro que quieres borrar este plato?')">Borrar</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
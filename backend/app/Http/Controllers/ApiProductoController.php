<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;

class ApiProductoController extends Controller
{
    // 1. GET: Obtener todos los productos
    public function index()
    {
        // Traemos productos con su categoría
        $productos = Producto::with('categoria')->get(); 
        return response()->json($productos);
    }

    // 2. POST: Guardar un nuevo producto
    public function store(Request $request)
    {
        // Validamos
        $request->validate([
            'nombre' => 'required',
            'precio' => 'required|numeric',
            'categoria_id' => 'required'
        ]);

        // Creamos
        $producto = Producto::create($request->all());

        // Respondemos con el producto creado y código 201 (Created)
        return response()->json([
            'mensaje' => 'Plato creado exitosamente',
            'datos' => $producto
        ], 201);
    }

    // 3. GET: Obtener un solo producto por ID
    public function show($id)
    {
        $producto = Producto::with('categoria')->find($id);

        if (!$producto) {
            return response()->json(['mensaje' => 'Plato no encontrado'], 404);
        }

        return response()->json($producto);
    }

    // 4. PUT: Actualizar un producto
    public function update(Request $request, $id)
    {
        $producto = Producto::find($id);

        if (!$producto) {
            return response()->json(['mensaje' => 'Plato no encontrado'], 404);
        }

        $producto->update($request->all());

        return response()->json([
            'mensaje' => 'Plato actualizado',
            'datos' => $producto
        ]);
    }

    // 5. DELETE: Borrar un producto
    public function destroy($id)
    {
        $producto = Producto::find($id);

        if (!$producto) {
            return response()->json(['mensaje' => 'Plato no encontrado'], 404);
        }

        $producto->delete();

        return response()->json(['mensaje' => 'Plato eliminado correctamente']);
    }
}
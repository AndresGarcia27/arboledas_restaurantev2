<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Categoria; // Importante: necesitamos las categorías para el select

class AdminProductoController extends Controller
{
    // 1. Mostrar la lista de productos (READ)
    public function index()
    {
        $productos = Producto::with('categoria')->get();
        return view('admin.index', compact('productos'));
    }

    // 2. Mostrar el formulario de crear (CREATE - VISTA)
    public function create()
    {
        $categorias = Categoria::all(); // Mandamos las categorías para poder elegir
        return view('admin.create', compact('categorias'));
    }

    // 3. Guardar el nuevo producto en la BD (CREATE - ACCIÓN)
    public function store(Request $request)
    {
        // Validamos que no manden datos vacíos
        $request->validate([
            'nombre' => 'required',
            'precio' => 'required|numeric',
            'categoria_id' => 'required'
        ]);

        Producto::create($request->all()); // Guardamos todo de una

        return redirect()->route('admin.productos.index')->with('success', '¡Plato creado con éxito!');
    }

    // 4. Mostrar el formulario de editar (UPDATE - VISTA)
    public function edit($id)
    {
        $producto = Producto::findOrFail($id); // Buscamos el plato
        $categorias = Categoria::all();        // Necesitamos las categorías de nuevo
        return view('admin.edit', compact('producto', 'categorias'));
    }

    // 5. Guardar los cambios (UPDATE - ACCIÓN)
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required',
            'precio' => 'required|numeric',
            'categoria_id' => 'required'
        ]);

        $producto = Producto::findOrFail($id);
        $producto->update($request->all());

        return redirect()->route('admin.productos.index')->with('success', '¡Plato actualizado!');
    }

    // 6. Eliminar el producto (DELETE)
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();

        return redirect()->route('admin.productos.index')->with('success', '¡Plato eliminado!');
    }
}
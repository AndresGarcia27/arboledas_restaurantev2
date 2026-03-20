<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Categoria;
use Illuminate\Support\Facades\Storage; // Para borrar imágenes viejas

class AdminProductoController extends Controller
{
    // 1. Obtener todos los productos (Para tu tabla en React)
    public function index()
    {
        // Traemos el producto con su categoría relacionada
        $productos = Producto::with('categoria')->get();
        return response()->json($productos);
    }

    // 2. Guardar nuevo producto (Con soporte para imagen)
    public function store(Request $request)
    {
        $request->validate([
            'nombre'       => 'required|string',
            'precio'       => 'required|numeric',
            'categoria_id' => 'required|integer',
            'imagen'       => 'nullable|image|mimes:jpg,png,jpeg|max:2048' // Máximo 2MB
        ]);

        $data = $request->all();

        // Lógica de imagen
        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('productos', 'public');
            $data['imagen_url'] = asset('storage/' . $path);
        }

        $producto = Producto::create($data);

        return response()->json([
            'message' => '¡Plato creado con éxito!',
            'producto' => $producto
        ], 201);
    }

    // 3. Obtener un solo producto (Por si necesitas ver detalles)
    public function show($id)
    {
        $producto = Producto::with('categoria')->findOrFail($id);
        return response()->json($producto);
    }

    // 4. Actualizar producto
    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);

        $request->validate([
            'nombre' => 'required',
            'precio' => 'required|numeric',
        ]);

        $data = $request->all();

        // Si subes una imagen nueva, borramos la anterior del disco
        if ($request->hasFile('imagen')) {
            // Borrar imagen vieja si existe
            if ($producto->imagen_url) {
                $oldPath = str_replace(asset('storage/'), '', $producto->imagen_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('imagen')->store('productos', 'public');
            $data['imagen_url'] = asset('storage/' . $path);
        }

        $producto->update($data);

        return response()->json([
            'message' => '¡Plato actualizado!',
            'producto' => $producto
        ]);
    }

    // 5. Eliminar producto
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        
        // Borrar la imagen del servidor antes de borrar el registro
        if ($producto->imagen_url) {
            $path = str_replace(asset('storage/'), '', $producto->imagen_url);
            Storage::disk('public')->delete($path);
        }

        $producto->delete();

        return response()->json(['message' => '¡Plato eliminado!']);
    }
}
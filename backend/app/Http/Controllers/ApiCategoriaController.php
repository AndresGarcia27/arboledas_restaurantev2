<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categoria;

class ApiCategoriaController extends Controller
{
    // VER todas las categorías
    public function index()
    {
        return response()->json(Categoria::all());
    }

    // CREAR una categoría nueva
    public function store(Request $request)
    {
        $request->validate(['nombre' => 'required']);
        $categoria = Categoria::create($request->all());
        return response()->json($categoria, 201);
    }

    // VER una categoría específica
    public function show($id)
    {
        return response()->json(Categoria::find($id));
    }

    // ACTUALIZAR una categoría
    public function update(Request $request, $id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->update($request->all());
        return response()->json($categoria);
    }

    // BORRAR una categoría
    public function destroy($id)
    {
        Categoria::destroy($id);
        return response()->json(['mensaje' => 'Categoría eliminada']);
    }
}
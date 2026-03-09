<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Resena;

class ApiResenaController extends Controller
{
    public function index()
    {
        return response()->json(Resena::with(['1', 'producto'])->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'calificacion' => 'required|integer|min:1|max:5', // Solo del 1 al 5
            'cliente_id' => 'required|exists:clientes,cliente_id',
            'producto_id' => 'required|exists:productos,producto_id',
            'comentario' => 'nullable|string'
        ]);

        $resena = Resena::create($request->all());
        return response()->json(['mensaje' => '¡Gracias por tu opinión!', 'resena' => $resena], 201);
    }

    public function show($id)
    {
        return response()->json(Resena::with(['1', 'producto'])->find($id));
    }

    public function destroy($id)
    {
        Resena::destroy($id);
        return response()->json(['mensaje' => 'Reseña eliminada']);
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MetodoPago;

class ApiMetodoPagoController extends Controller
{
    public function index()
    {
        return response()->json(MetodoPago::all());
    }

    public function store(Request $request)
    {
        $request->validate(['nombre' => 'required']);
        $metodo = MetodoPago::create($request->all());
        return response()->json($metodo, 201);
    }

    public function show($id)
    {
        return response()->json(MetodoPago::find($id));
    }

    public function update(Request $request, $id)
    {
        $metodo = MetodoPago::findOrFail($id);
        $metodo->update($request->all());
        return response()->json($metodo);
    }

    public function destroy($id)
    {
        MetodoPago::destroy($id);
        return response()->json(['mensaje' => 'Método eliminado']);
    }
}
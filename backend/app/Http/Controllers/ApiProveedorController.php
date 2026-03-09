<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Proveedor;

class ApiProveedorController extends Controller
{
    public function index()
    {
        return response()->json(Proveedor::all());
    }

    public function store(Request $request)
    {
        $request->validate(['nombre' => 'required', 'email' => 'required|email']);
        $proveedor = Proveedor::create($request->all());
        return response()->json($proveedor, 201);
    }

    public function show($id)
    {
        return response()->json(Proveedor::find($id));
    }

    public function update(Request $request, $id)
    {
        $proveedor = Proveedor::findOrFail($id);
        $proveedor->update($request->all());
        return response()->json($proveedor);
    }

    public function destroy($id)
    {
        Proveedor::destroy($id);
        return response()->json(['mensaje' => 'Proveedor eliminado']);
    }
}
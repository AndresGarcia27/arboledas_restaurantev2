<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pago;

class ApiPagoController extends Controller
{
    public function index()
    {
        // Traer pago con su Pedido y su Método (ej: Nequi)
        return response()->json(Pago::with(['pedido', 'metodoPago'])->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'monto' => 'required|numeric',
            'pedido_id' => 'required|exists:pedidos,pedido_id|unique:pagos', // Un pedido solo se paga una vez
            'metodo_pago_id' => 'required|exists:metodo_pagos,metodo_pago_id'
        ]);

        $pago = Pago::create($request->all());
        return response()->json(['mensaje' => 'Pago registrado con éxito', 'pago' => $pago], 201);
    }

    public function show($id)
    {
        return response()->json(Pago::with(['pedido', 'metodoPago'])->find($id));
    }

    public function destroy($id)
    {
        Pago::destroy($id);
        return response()->json(['mensaje' => 'Registro de pago eliminado']);
    }
}
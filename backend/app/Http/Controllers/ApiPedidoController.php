<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;

class ApiPedidoController extends Controller
{
    public function index()
    {
        // Traemos el pedido CON la información del cliente y el producto
        $pedidos = Pedido::with(['1', 'producto'])->get();
        return response()->json($pedidos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cliente_id' => 'required|exists:clientes,cliente_id', // Verifica que el cliente exista
            'producto_id' => 'required|exists:productos,producto_id', // Verifica que el plato exista
            'total' => 'required',
            'estado' => 'required'
        ]);

        $pedido = Pedido::create($request->all());
        return response()->json(['mensaje' => '¡Pedido recibido!', 'orden' => $pedido], 201);
    }

    public function show($id)
    {
        $pedido = Pedido::with(['1', 'producto'])->find($id);
        if (!$pedido) return response()->json(['error' => 'Pedido no encontrado'], 404);
        return response()->json($pedido);
    }

    public function update(Request $request, $id)
    {
        $pedido = Pedido::findOrFail($id);
        $pedido->update($request->all());
        return response()->json(['mensaje' => 'Estado del pedido actualizado', 'orden' => $pedido]);
    }

    public function destroy($id)
    {
        Pedido::destroy($id);
        return response()->json(['mensaje' => 'Pedido cancelado/eliminado']);
    }
}
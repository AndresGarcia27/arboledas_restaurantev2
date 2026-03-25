<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\Pago;
use Illuminate\Support\Facades\Http; 

class ApiPedidoController extends Controller
{
    public function index()
    {
        $pedidos = Pedido::with(['cliente', 'producto'])->get();
        return response()->json($pedidos);
    }

    // --- 1. FUNCIÓN PARA PEDIR LA VENTANA DE COBRO A MERCADO PAGO ---
    public function crearPreferencia(Request $request)
    {
        $request->validate(['cart' => 'required|array']);

        $items = [];
        foreach ($request->cart as $item) {
            $items[] = [
                'title' => $item['nombre'],
                'quantity' => (int) $item['cantidad'],
                'unit_price' => (float) $item['precio'],
                'currency_id' => 'COP', 
            ];
        }

        // Tu token real de prueba
        $accessToken = 'APP_USR-1188678407826162-032414-6860b6f4f509655d0c56f2de252b6073-3290313912';

        // 👇 Le añadimos asJson() para que Mercado Pago no se confunda con las URLs
       $response = Http::asJson()->withToken($accessToken)->post('https://api.mercadopago.com/checkout/preferences', [
            'items' => $items,
            'back_urls' => [
                // 👇 MAGIA AQUÍ: Le agregamos la 's' a http 👇
                'success' => 'https://localhost:5174/pago-exitoso',
                'failure' => 'https://localhost:5174/checkout',    
                'pending' => 'https://localhost:5174/checkout'
            ],
            'auto_return' => 'approved',
        ]);

        if ($response->successful()) {
            return response()->json(['init_point' => $response->json()['init_point']]);
        }

        // Dejamos el chismoso activado por si llega a fallar algo más
        return response()->json([
            'error' => 'No se pudo conectar con Mercado Pago',
            'motivo_real' => $response->json() 
        ], 500);
    }

    // --- 2. FUNCIÓN PARA GUARDAR EL PEDIDO CUANDO EL PAGO ES EXITOSO ---
    public function procesarCheckout(Request $request)
    {
        $request->validate([
            'cliente_id' => 'required',
            'cart' => 'required|array',
            'payment_id' => 'required' 
        ]);

        $pedidosGuardados = [];

        foreach ($request->cart as $item) {
            $pedido = Pedido::create([
                'cliente_id' => $request->cliente_id,
                'producto_id' => $item['id'],
                'fecha' => now()->toDateString(),
                'total' => $item['precio'] * $item['cantidad'],
                'estado' => 'pagado' 
            ]);

            Pago::create([
                'pedido_id' => $pedido->pedido_id,
                'monto' => $item['precio'] * $item['cantidad'],
                'metodo_pago_id' => 1 // ID de Mercado Pago en tu tabla
            ]);

            $pedidosGuardados[] = $pedido;
        }

        return response()->json(['mensaje' => '¡Pedidos registrados!', 'pedidos' => $pedidosGuardados], 201);
    }

    public function show($id) { 
        $pedido = Pedido::with(['cliente', 'producto'])->find($id);
        if (!$pedido) return response()->json(['error' => 'Pedido no encontrado'], 404);
        return response()->json($pedido);
    }

    public function update(Request $request, $id) { 
        $pedido = Pedido::findOrFail($id);
        $pedido->update($request->all());
        return response()->json(['mensaje' => 'Estado actualizado', 'orden' => $pedido]);
    }

    public function destroy($id) { 
        Pedido::destroy($id);
        return response()->json(['mensaje' => 'Pedido eliminado']);
    }
}
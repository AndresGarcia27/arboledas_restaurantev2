<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log; // 👈 Para guardar errores de correo en secreto sin romper la app

class ReservaController extends Controller
{
    // Mostrar reservas
    public function index(Request $request)
    {
        $query = Reserva::with('cliente')->orderBy('fecha', 'desc')->orderBy('hora', 'desc');

        if ($request->has('cliente_id')) {
            $query->where('cliente_id', $request->cliente_id);
        }

        return response()->json($query->get(), 200);
    }

    // 1. Crear la reserva (¡SIN ENVIAR CORREO!)
    public function store(Request $request)
    {
        $request->validate([
            'cliente_id' => 'required',
            'fecha' => 'required|date',
            'hora' => 'required',
            'personas' => 'required|integer|min:1',
            'estado' => 'nullable|string'
        ]);

        $data = $request->all();
        if (empty($data['estado'])) {
            $data['estado'] = 'pendiente'; 
        }

        $cliente = Cliente::where('cliente_id', $data['cliente_id'])->first() ?? Cliente::find($data['cliente_id']);

        if (!$cliente) {
            return response()->json([
                'mensaje' => 'Error: El sistema no detectó tu ID de cliente. Cierra sesión y vuelve a entrar.'
            ], 400);
        }

        // Solo guardamos en la base de datos, silenciosamente
        $reserva = Reserva::create($data);

        return response()->json($reserva, 201);
    }

    // 2. Actualizar reserva (¡AQUÍ SE ENVÍA EL CORREO SI SE CONFIRMA!)
    public function update(Request $request, $id)
    {
        $reserva = Reserva::findOrFail($id);
        $estadoAnterior = $reserva->estado; // Guardamos cómo estaba antes

        // Actualizamos con los datos que mande el Admin (ej. estado: 'confirmada')
        $reserva->update($request->all());

        // Si el admin la cambió a 'confirmada' y ANTES no estaba confirmada, disparamos el correo
        if ($estadoAnterior !== 'confirmada' && $reserva->estado === 'confirmada') {
            
            $cliente = Cliente::where('cliente_id', $reserva->cliente_id)->first() ?? Cliente::find($reserva->cliente_id);

            if ($cliente) {
                $mensaje = "Hola {$cliente->nombre},\n\n";
                $mensaje .= "¡Excelentes noticias! Tu reserva en Arboleda's ha sido CONFIRMADA.\n\n";
                $mensaje .= "Tus detalles oficiales:\n";
                $mensaje .= "📅 Fecha: {$reserva->fecha}\n";
                $mensaje .= "⏰ Hora: {$reserva->hora}\n";
                $mensaje .= "👥 Personas: {$reserva->personas}\n\n";
                $mensaje .= "¡Te esperamos con los brazos abiertos para que disfrutes de la mejor experiencia!";

                try {
                    Mail::raw($mensaje, function ($mail) use ($cliente) {
                        $mail->to($cliente->email)
                             ->subject("¡Reserva Confirmada! Nos vemos en Arboleda's");
                    });
                } catch (\Exception $e) {
                    // Si el correo falla, guardamos el error en los logs de Laravel pero no le lanzamos error al admin
                    Log::error("Error al enviar correo de reserva al cliente ID {$cliente->cliente_id}: " . $e->getMessage());
                }
            }
        }

        return response()->json($reserva, 200);
    }

    // Eliminar / Cancelar reserva
    public function destroy($id)
    {
        Reserva::destroy($id);
        return response()->json(['message' => 'Reserva eliminada'], 200);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ReservaController extends Controller
{
    // Mostrar reservas (Si es admin ve todas, si es cliente ve solo las suyas)
    public function index(Request $request)
    {
        $query = Reserva::with('cliente')->orderBy('fecha', 'desc')->orderBy('hora', 'desc');

        // Si React nos manda un ID específico, filtramos la tabla
        if ($request->has('cliente_id')) {
            $query->where('cliente_id', $request->cliente_id);
        }

        return response()->json($query->get(), 200);
    }

    // Crear una nueva reserva y enviar correo
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

        // 👇 Búsqueda BLINDADA del cliente
        $cliente = Cliente::where('cliente_id', $data['cliente_id'])->first();
        if (!$cliente) {
            $cliente = Cliente::find($data['cliente_id']);
        }

        // 🚨 TRAMPA 1: Si no encuentra al cliente, lanzamos error y frenamos todo
        if (!$cliente) {
            return response()->json([
                'mensaje' => 'Error: El sistema no detectó tu ID de cliente. Cierra sesión y vuelve a entrar.'
            ], 400);
        }

        // Si lo encuentra, creamos la reserva en la base de datos
        $reserva = Reserva::create($data);

        $mensaje = "Hola {$cliente->nombre},\n\n";
        $mensaje .= "¡Hemos recibido tu solicitud de reserva en Arboleda's!\n\n";
        $mensaje .= "Tus detalles:\n";
        $mensaje .= "📅 Fecha: {$reserva->fecha}\n";
        $mensaje .= "⏰ Hora: {$reserva->hora}\n";
        $mensaje .= "👥 Personas: {$reserva->personas}\n";
        $mensaje .= "📌 Estado: PENDIENTE (Te confirmaremos muy pronto)\n\n";
        $mensaje .= "¡Gracias por preferirnos!";

        // 🚨 TRAMPA 2: Intentamos enviar el correo. Si falla, avisamos el porqué exacto.
        try {
            Mail::raw($mensaje, function ($mail) use ($cliente) {
                $mail->to($cliente->email)
                     ->subject("Confirmación de Reserva - Arboleda's");
            });
        } catch (\Exception $e) {
            // Si el correo falla, borramos la reserva para que no quede huérfana
            $reserva->delete();
            return response()->json([
                'mensaje' => 'Error al intentar enviar el correo de confirmación con Gmail.',
                'error_detalle' => $e->getMessage()
            ], 500);
        }

        // Si sobrevive a todas las trampas, es un éxito total
        return response()->json($reserva, 201);
    }

    // Actualizar una reserva
    public function update(Request $request, $id)
    {
        $reserva = Reserva::findOrFail($id);
        $reserva->update($request->all());
        return response()->json($reserva, 200);
    }

    // Eliminar / Cancelar reserva
    public function destroy($id)
    {
        Reserva::destroy($id);
        return response()->json(['message' => 'Reserva eliminada'], 200);
    }
}
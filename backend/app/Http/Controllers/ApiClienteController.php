<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB; // Vital para la limpieza de tablas

class ApiClienteController extends Controller
{
    // Listar todos los clientes
    public function index() {
        return response()->json(Cliente::all(), 200);
    }

    // Registrar nuevo cliente
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:clientes,email',
            'telefono' => 'required',
            'password' => 'required|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json(['errores' => $validator->errors()], 422);
        }

        $cliente = Cliente::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'telefono' => $request->telefono,
            'password' => Hash::make($request->password),
            'rol' => '1'
        ]);

        return response()->json(['mensaje' => 'Bienvenido a Arboleda', '1' => $cliente], 201);
    }

    // Mostrar un cliente específico
    public function show($id) {
        $cliente = Cliente::find($id);
        if (!$cliente) {
            return response()->json(['mensaje' => 'Cliente no encontrado'], 404);
        }
        return response()->json($cliente, 200);
    }

    // Actualizar datos del cliente
    public function update(Request $request, $id) {
        $cliente = Cliente::find($id);
        if (!$cliente) {
            return response()->json(['mensaje' => 'No existe el cliente'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:clientes,email,' . $id . ',cliente_id',
            'telefono' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errores' => $validator->errors()], 422);
        }

        try {
            $cliente->update($request->all());
            return response()->json(['mensaje' => 'Datos actualizados correctamente', '1' => $cliente], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Fallo interno en el servidor'], 500);
        }
    }

    // --- ELIMINAR CLIENTE (Lógica Unificada y Corregida) ---
    public function destroy($id) {
        $cliente = Cliente::find($id);

        if (!$cliente) {
            return response()->json(['mensaje' => 'El cliente ya no existe'], 404);
        }

        try {
            DB::transaction(function () use ($cliente, $id) {
                // 1. Limpiamos solo la tabla 'pedidos' porque ahí sí existe 'cliente_id'
                DB::table('pedidos')->where('cliente_id', $id)->delete();

                // Nota: No tocamos 'pagos' ni 'resenas' porque no tienen la columna 'cliente_id'
                // Si esas tablas fallan después, es porque están unidas al ID de un pedido, no del cliente.

                // 2. Ahora borramos al cliente sin que MySQL nos bloquee
                $cliente->delete();
            });

            return response()->json(['mensaje' => 'Cliente y sus pedidos eliminados con éxito'], 200);

        } catch (\Exception $e) {
            return response()->json([
                'mensaje' => 'Error al eliminar: Verifica si el cliente tiene registros en otras tablas.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Login
    public function login(Request $request) {
        $cliente = Cliente::where('email', $request->email)->first();
        if (!$cliente || !Hash::check($request->password, $cliente->password)) {
            return response()->json(['mensaje' => 'Credenciales inválidas'], 401);
        }
        return response()->json(['mensaje' => 'Hola de nuevo', '1' => $cliente], 200);
    }
}
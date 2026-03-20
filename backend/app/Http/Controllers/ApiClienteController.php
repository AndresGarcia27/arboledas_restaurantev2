<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail; // 👈 Importante para enviar correos

class ApiClienteController extends Controller
{
    public function index() {
        return response()->json(Cliente::all(), 200);
    }

    // REGISTRAR CLIENTE Y ENVIAR CÓDIGO
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:clientes,email',
            'telefono' => 'required|min:7',
            'password' => 'required|min:6'
        ], [
            'nombre.required' => 'El nombre completo es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Debes ingresar un correo válido.',
            'email.unique' => '¡Este correo ya está registrado! Inicia sesión.',
            'telefono.required' => 'El teléfono es obligatorio.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres.'
        ]);

        if ($validator->fails()) {
            return response()->json(['errores' => $validator->errors()], 422);
        }

        // 1. Generamos un código de 6 dígitos aleatorio
        $codigo = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        // 2. Creamos al cliente con su código
        $cliente = Cliente::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'telefono' => $request->telefono,
            'password' => Hash::make($request->password),
            'rol' => '2',
            'codigo_verificacion' => $codigo // Guardamos el código secreto
        ]);

        // 3. Enviamos el correo de forma rápida
        try {
            Mail::raw("Hola {$cliente->nombre},\n\nTu código de verificación en Arboleda's es: {$codigo}\n\nIngrésalo en la plataforma para activar tu cuenta.", function ($message) use ($cliente) {
                $message->to($cliente->email)
                        ->subject('Código de Verificación - Arboleda');
            });
        } catch (\Exception $e) {
            // Si el correo falla, igual dejamos crear la cuenta pero avisamos
        }

        return response()->json([
            'mensaje' => 'Registro exitoso, verifica tu correo.', 
            'user' => $cliente 
        ], 201);
    }

    // NUEVA FUNCIÓN: VERIFICAR EL CÓDIGO
    public function verificar(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'codigo' => 'required|string|size:6'
        ]);

        $cliente = Cliente::where('email', $request->email)->first();

        // Comprobamos si el cliente existe y si el código coincide
        if ($cliente && $cliente->codigo_verificacion === $request->codigo) {
            // Vaciamos el código y ponemos la fecha de verificación
            $cliente->codigo_verificacion = null;
            $cliente->email_verified_at = now();
            $cliente->save();

            return response()->json(['mensaje' => 'Correo verificado correctamente.'], 200);
        }

        return response()->json(['mensaje' => 'El código es incorrecto o ya fue usado.'], 400);
    }

    public function show($id) {
        $cliente = Cliente::find($id);
        return $cliente ? response()->json($cliente, 200) : response()->json(['mensaje' => 'No encontrado'], 404);
    }

    public function update(Request $request, $id) {
        $cliente = Cliente::find($id);
        if (!$cliente) return response()->json(['mensaje' => 'No existe'], 404);
        $cliente->update($request->all());
        return response()->json(['mensaje' => 'Actualizado', 'user' => $cliente], 200);
    }

    public function destroy($id) {
        $cliente = Cliente::find($id);
        if ($cliente) {
            DB::table('pedidos')->where('cliente_id', $id)->delete();
            $cliente->delete();
            return response()->json(['mensaje' => 'Eliminado'], 200);
        }
        return response()->json(['mensaje' => 'No existe'], 404);
    }

    public function login(Request $request) {
        $cliente = Cliente::where('email', $request->email)->first();
        if (!$cliente || !Hash::check($request->password, $cliente->password)) {
            return response()->json(['mensaje' => 'Credenciales inválidas'], 401);
        }
        return response()->json(['mensaje' => 'Hola', 'user' => $cliente], 200);
    }
}
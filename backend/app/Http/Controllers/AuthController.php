<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Cliente; // ✅ Corregido: "Cliente" con C mayúscula

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validar que React envíe el email y la contraseña
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // 2. Buscar al usuario usando el modelo Cliente (Con mayúscula)
        $user = Cliente::where('email', $request->email)->first(); 

        // 3. Verificar si el usuario existe y si la contraseña coincide
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Las credenciales son incorrectas.'
            ], 401); 
        }

        // 4. Crear el token de seguridad
        $token = $user->createToken('token_arboledas')->plainTextToken;

        // 5. Devolver los datos. 
        // ✅ OJO: Usamos la palabra 'user' a la izquierda para que React la reconozca sin fallar.
        return response()->json([
            'message' => '¡Bienvenido a Arboledas!',
            'user' => [
                'id' => $user->id,
                'nombre' => $user->nombre,
                'email' => $user->email,
                'rol' => $user->rol,
            ],
            'token' => $token
        ], 200); 
    }

    public function logout(Request $request)
    {
        // ✅ En Laravel, la sesión actual siempre se lee con user(), sin importar el modelo.
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }
}
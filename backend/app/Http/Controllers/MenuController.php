<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto; // Importamos el modelo Producto

class MenuController extends Controller
{
    public function index()
    {
        // 1. Le decimos al modelo: "Tráeme todos los productos y cárgame también su categoría"
        $productos = Producto::with('categoria')->get();

        // 2. Le enviamos esos datos a la vista (que crearemos en el paso 3)
        return view('menu', compact('productos'));
    }
}
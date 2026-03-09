<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;
use App\Models\Producto;

class RestauranteSeeder extends Seeder
{
    public function run()
    {
        // 1. Crear las Categorías
        $platosFuertes = Categoria::create([
            'nombre' => 'Platos Fuertes',
            'descripcion' => 'Platos principales con ingredientes premium',
            'imagen_url' => 'url_platos.jpg'
        ]);

        $postres = Categoria::create([
            'nombre' => 'Postres',
            'descripcion' => 'Dulces artesanales',
            'imagen_url' => 'url_postres.jpg'
        ]);

        $bebidas = Categoria::create([
            'nombre' => 'Bebidas',
            'descripcion' => 'Vinos y refrescos',
            'imagen_url' => 'url_bebidas.jpg'
        ]);

        // 2. Crear los Productos (Usando los ID de las categorías que acabamos de crear)
        
        // --- Platos Fuertes ---
        Producto::create([
            'nombre' => 'Ceviche de Mango y Camarones',
            'descripcion' => 'Camarones tigre frescos marinados en leche de tigre con mango tropical.',
            'precio' => 38000.00,
            'categoria_id' => $platosFuertes->categoria_id,
            'sku' => 'PLA-001'
        ]);

        Producto::create([
            'nombre' => 'Lomo en Costra de Hierbas',
            'descripcion' => 'Lomo de res premium en costra de hierbas finas.',
            'precio' => 45000.00,
            'categoria_id' => $platosFuertes->categoria_id,
            'sku' => 'PLA-002'
        ]);

        // --- Postres ---
        Producto::create([
            'nombre' => 'Tiramisú de Café Colombiano',
            'descripcion' => 'Versión artesanal con café colombiano premium.',
            'precio' => 22000.00,
            'categoria_id' => $postres->categoria_id,
            'sku' => 'POS-001'
        ]);

        Producto::create([
            'nombre' => 'Volcán de Chocolate Belga',
            'descripcion' => 'Bizcocho de chocolate 70% cacao con centro líquido.',
            'precio' => 26000.00,
            'categoria_id' => $postres->categoria_id,
            'sku' => 'POS-002'
        ]);

        // --- Bebidas ---
        Producto::create([
            'nombre' => 'Vino Tinto Reserva',
            'descripcion' => 'Copa de vino tinto reserva especial.',
            'precio' => 32000.00,
            'categoria_id' => $bebidas->categoria_id,
            'sku' => 'BEB-001'
        ]);
    }
}
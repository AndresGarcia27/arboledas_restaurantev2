<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    \App\Models\Cliente::create([
        'nombre' => 'Administrador Arboleda',
        'email' => 'admin@arboledas.com',
        'password' => \Illuminate\Support\Facades\Hash::make('admin1234'), // Tu clave
        'telefono' => '3000000000',
        'rol' => 'admin' // <--- Aquí le das el poder
    ]);
}
};

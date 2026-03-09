<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

use App\Http\Controllers\MenuController;

// Antes era '/menu', ahora es '/' para que sea la portada
Route::get('/', [MenuController::class, 'index']);

use App\Http\Controllers\AdminProductoController;

// Esta línea mágica crea 7 rutas automáticamente (ver, crear, guardar, editar, etc.)
Route::resource('admin/productos', AdminProductoController::class)->names('admin.productos');

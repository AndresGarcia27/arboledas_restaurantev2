<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proveedor extends Model
{
    use HasFactory;
    
    // Le decimos a Laravel cuál es la llave de esta tabla
    protected $primaryKey = 'proveedor_id';
    
    // Definimos qué campos se pueden llenar
    protected $fillable = ['nombre', 'contacto', 'telefono', 'email'];
    
    // Opcional: Le decimos que la tabla en la BD se llama 'proveedores' 
    // (Laravel suele adivinarlo bien, pero es mejor asegurar)
    protected $table = 'proveedores';
}
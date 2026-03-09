<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;
    protected $primaryKey = 'categoria_id'; // Le decimos que el ID no es 'id' sino 'categoria_id'
    protected $fillable = ['nombre', 'descripcion', 'precio', 'sku', 'peso', 'imagen_url'];
}
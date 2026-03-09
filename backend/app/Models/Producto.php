<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;
    protected $primaryKey = 'producto_id';
    protected $fillable = ['nombre', 'descripcion', 'precio', 'sku', 'imagen_url', 'categoria_id'];

    // Relación: Un producto pertenece a una Categoría
    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }
}
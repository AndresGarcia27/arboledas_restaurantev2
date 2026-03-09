<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resena extends Model
{
    use HasFactory;

    protected $primaryKey = 'resena_id';
    
    protected $fillable = ['calificacion', 'comentario', 'fecha', 'cliente_id', 'producto_id'];

    // Relación: La reseña la escribió un Cliente
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    // Relación: La reseña es sobre un Producto
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}
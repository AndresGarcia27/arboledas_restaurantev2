<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    use HasFactory;

    protected $primaryKey = 'reserva_id';

    // ¡La lista VIP de campos permitidos!
    protected $fillable = [
        'cliente_id', 
        'fecha', 
        'hora', 
        'personas', 
        'estado', 
        'comentarios'
    ];

    // Con esto le decimos a Laravel a quién pertenece la reserva
    public function cliente()
    {
        // 👇 AJUSTE: Le decimos exactamente qué llaves buscar para que no adivine
        return $this->belongsTo(Cliente::class, 'cliente_id', 'cliente_id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $primaryKey = 'pedido_id';
    
    // Ojo aquí: permitimos llenar los IDs de cliente y producto
    protected $fillable = ['fecha', 'total', 'estado', 'cliente_id', 'producto_id'];

    // --- RELACIONES (Los cables que conectan las tablas) ---

    // Un pedido "pertenece a" un Cliente
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    // Un pedido "pertenece a" un Producto
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    // Un pedido "tiene" un Pago
    public function pago()
    {
        return $this->hasOne(Pago::class, 'pedido_id');
    }
}
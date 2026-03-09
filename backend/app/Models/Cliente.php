<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Cliente extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'clientes';
    
    // Configuraciones de llave primaria para evitar errores 500
    protected $primaryKey = 'cliente_id'; 
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nombre',
        'email',
        'telefono',
        'password',
        'rol',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
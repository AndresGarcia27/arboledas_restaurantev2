<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; 

class Cliente extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'clientes';
    
    // Configuraciones de llave primaria
    protected $primaryKey = 'cliente_id'; 
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nombre',
        'email',
        'telefono',
        'password',
        'rol',
        'email_verified_at',
        'codigo_verificacion'
    ];
    
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // 👇 EL TRUCO MAESTRO 👇
    // Obligamos a Laravel a incluir siempre una llave llamada 'id' en el JSON
    protected $appends = ['id'];

    // Le decimos de dónde sacar el valor para ese 'id'
    public function getIdAttribute()
    {
        return $this->attributes['cliente_id'] ?? null;
    }
}
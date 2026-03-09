<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MetodoPago extends Model
{
    use HasFactory;

    protected $primaryKey = 'metodo_pago_id';
    protected $fillable = ['nombre'];
    protected $table = 'metodo_pagos';
}
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('pagos', function (Blueprint $table) {
        $table->id('pago_id');
        $table->decimal('monto', 10, 2);
        
        // Relación con Pedido
        $table->unsignedBigInteger('pedido_id');
        $table->foreign('pedido_id')->references('pedido_id')->on('pedidos');

        // Relación con Método de Pago (EL NUEVO CAMBIO)
        $table->unsignedBigInteger('metodo_pago_id');
        $table->foreign('metodo_pago_id')->references('metodo_pago_id')->on('metodo_pagos');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // En database/migrations/xxxx_create_reservas_table.php
public function up() {
    Schema::create('reservas', function (Blueprint $table) {
        $table->id('reserva_id');
        // Relación con tu tabla 'clientes' y su PK 'cliente_id'
        $table->unsignedBigInteger('cliente_id');
        $table->foreign('cliente_id')->references('cliente_id')->on('clientes')->onDelete('cascade');
        
        $table->date('fecha');
        $table->time('hora');
        $table->integer('personas');
        $table->string('estado')->default('pendiente'); // pendiente, confirmada, cancelada
        $table->text('comentarios')->nullable();
        $table->timestamps();
    });
}
};

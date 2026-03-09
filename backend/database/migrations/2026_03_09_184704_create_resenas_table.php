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
    Schema::create('resenas', function (Blueprint $table) {
        $table->id('resena_id');
        $table->integer('calificacion');
        $table->text('comentario')->nullable();
        $table->dateTime('fecha')->useCurrent();
        
        $table->unsignedBigInteger('cliente_id');
        $table->foreign('cliente_id')->references('cliente_id')->on('clientes');
        
        $table->unsignedBigInteger('producto_id');
        $table->foreign('producto_id')->references('producto_id')->on('productos');

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resenas');
    }
};

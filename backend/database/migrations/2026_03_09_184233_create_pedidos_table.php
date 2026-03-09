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
    Schema::create('pedidos', function (Blueprint $table) {
        $table->id('pedido_id');
        $table->dateTime('fecha')->useCurrent();
        $table->decimal('total', 10, 2);
        $table->string('estado')->default('Pendiente');
        
        // Llaves foráneas
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
        Schema::dropIfExists('pedidos');
    }
};

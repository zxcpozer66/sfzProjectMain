<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
    public function up()
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('username', 255)->nullable();
        $table->string('name', 255)->nullable();
        $table->string('surname', 255)->nullable();
        $table->string('patronymic', 255)->nullable();
        $table->foreignId('role_id')->nullable()->constrained();
        $table->unsignedBigInteger('department_id')->nullable(); 
        $table->timestamps();
        $table->softDeletes();
    });
}

    public function down()
    {
        Schema::dropIfExists('users');
    }
};

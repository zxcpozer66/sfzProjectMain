<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->timestamp('data')->useCurrent();
            $table->foreignId('department_id')->constrained();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('master_id')->constrained('users');
            $table->string('appeal_title', 255);
            $table->dateTime('start_time')->nullable();
            $table->dateTime('end_time')->nullable();
            $table->foreignId('type_reaction_id')->nullable()->constrained('reactions_type');
            $table->foreignId('notation_id')->nullable()->constrained();
            $table->string('order_application', 255)->nullable();
            $table->text('description_problem')->nullable();
            $table->text('description_task')->nullable();
            $table->text('answer')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('applications');
    }
};

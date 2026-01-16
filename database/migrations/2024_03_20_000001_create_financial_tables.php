<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('icon', 10);
            $table->string('color', 20);
            $table->enum('type', ['INCOME', 'EXPENSE']);
            $table->timestamps();
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained();
            $table->string('description');
            $table->decimal('amount', 15, 2);
            $table->date('date');
            $table->enum('type', ['INCOME', 'EXPENSE']);
            $table->enum('status', ['PAID', 'PENDING'])->default('PAID');
            $table->string('payment_method')->nullable();
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->decimal('target_amount', 15, 2);
            $table->decimal('current_amount', 15, 2)->default(0);
            $table->date('deadline');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('goals');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('categories');
    }
};

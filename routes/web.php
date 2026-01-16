<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

Route::prefix('transacoes')->name('transactions.')->group(function () {
    Route::get('/', [TransactionController::class, 'index'])->name('index');
    Route::post('/store', [TransactionController::class, 'store'])->name('store');
    Route::put('/update/{id}', [TransactionController::class, 'update'])->name('update');
    Route::delete('/delete/{id}', [TransactionController::class, 'destroy'])->name('destroy');
});

Route::get('/investimentos', function() {
    return view('investments');
})->name('investments');

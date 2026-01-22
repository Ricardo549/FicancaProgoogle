<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Goal;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id() ?: 1; // Fallback para dev

        $stats = Transaction::where('user_id', $userId)
            ->select('type', DB::raw('SUM(amount) as total'))
            ->groupBy('type')
            ->pluck('total', 'type');

        $income = $stats['INCOME'] ?? 0;
        $expense = $stats['EXPENSE'] ?? 0;
        
        $goals = Goal::where('user_id', $userId)->take(3)->get();
        
        $chartData = Transaction::where('user_id', $userId)
            ->whereYear('date', date('Y'))
            ->select(DB::raw('MONTH(date) as month'), 'type', DB::raw('SUM(amount) as total'))
            ->groupBy('month', 'type')
            ->get();

        return view('dashboard', compact('income', 'expense', 'goals', 'chartData'));
    }
}

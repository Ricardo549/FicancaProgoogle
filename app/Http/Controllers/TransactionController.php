
<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    /**
     * Atualiza uma transação ou uma série de transações recorrentes.
     */
    public function update(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);
        $updateMode = $request->input('update_mode', 'SINGLE'); // SINGLE, FUTURE, ALL

        $data = $request->only(['description', 'amount', 'category_id', 'payment_method', 'notes']);

        if ($updateMode === 'SINGLE' || !$transaction->series_id) {
            $transaction->update($data);
            return response()->json($transaction);
        }

        $query = Transaction::where('series_id', $transaction->series_id);

        if ($updateMode === 'FUTURE') {
            $query->where('date', '>=', $transaction->date);
        }

        $query->update($data);

        return response()->json(['message' => 'Série atualizada com sucesso']);
    }

    /**
     * Cria um novo lançamento (com suporte a geração de série se for recorrente)
     */
    public function store(Request $request)
    {
        $data = $request->all();
        $data['user_id'] = Auth::id();

        if ($request->input('is_recurring')) {
            $data['series_id'] = 'series_' . uniqid();
            // Lógica para gerar parcelas futuras poderia ser disparada aqui via Job
        }

        $transaction = Transaction::create($data);
        return response()->json($transaction);
    }
}

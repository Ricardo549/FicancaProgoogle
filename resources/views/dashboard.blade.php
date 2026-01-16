
@extends('layouts.app')

@section('content')
<div class="space-y-8 animate-in fade-in duration-700">
    <header class="flex justify-between items-center mb-10">
        <div>
            <h1 class="text-3xl font-black tracking-tight text-slate-800 dark:text-white">Dashboard <span class="text-emerald-600">Pro</span></h1>
            <p class="text-slate-400 font-medium">Arquitetura Laravel + Inteligência IA.</p>
        </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <x-stat-card title="Receitas" :value="$income" color="emerald" />
        <x-stat-card title="Despesas" :value="$expense" color="rose" />
        <x-stat-card title="Saldo" :value="$income - $expense" color="blue" />
        <x-stat-card title="Eficiência" value="84%" color="amber" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 class="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-6">Fluxo Mensal</h3>
            <div class="h-80">
                <canvas id="dashboardChart"></canvas>
            </div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 class="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-6">Metas Ativas</h3>
            <div class="space-y-6">
                @foreach($goals as $goal)
                    @php $p = ($goal->current_amount / $goal->target_amount) * 100; @endphp
                    <div class="space-y-2">
                        <div class="flex justify-between text-xs font-bold">
                            <span>{{ $goal->title }}</span>
                            <span class="text-emerald-600">{{ round($p) }}%</span>
                        </div>
                        <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                            <div class="h-full bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20" style="width: {{ $p }}%"></div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const ctx = document.getElementById('dashboardChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Receitas',
                    data: [4500, 5200, 4800, 6100, 5900, 7200],
                    borderColor: '#10b981',
                    tension: 0.4,
                    borderWidth: 4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, border: { display: false } },
                    y: { display: false }
                }
            }
        });
    });
</script>
@endsection

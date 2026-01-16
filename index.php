<?php 
require_once 'config.php';

// Simulação de usuário logado para demonstração
$userId = 1; 

// Busca Estatísticas
$stmt = $pdo->prepare("SELECT type, SUM(amount) as total FROM transactions WHERE userId = ? GROUP BY type");
$stmt->execute([$userId]);
$stats = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

$receitas = $stats['INCOME'] ?? 0;
$despesas = $stats['EXPENSE'] ?? 0;
$saldo = $receitas - $despesas;
$saude = getSaudeFinanceira($pdo, $userId);

include 'includes/header.php'; 
?>

<div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <?php include 'includes/sidebar.php'; ?>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-8 no-scrollbar">
        <header class="flex justify-between items-center mb-10">
            <div>
                <h1 class="text-3xl font-black tracking-tight">Painel de Controle</h1>
                <p class="text-slate-400 font-medium">Bem-vindo ao futuro da sua gestão financeira.</p>
            </div>
            <div class="flex items-center gap-4">
                <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Status IA</span>
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span class="text-xs font-bold">Conectado</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Cards de Estatísticas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <?php renderStatCard("Receitas", $receitas, "emerald", "trending-up"); ?>
            <?php renderStatCard("Despesas", $despesas, "rose", "trending-down"); ?>
            <?php renderStatCard("Saldo Livre", $saldo, "blue", "wallet"); ?>
            <?php renderStatCard("Saúde IA", $saude . "%", "amber", "star"); ?>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Gráfico Principal -->
            <div class="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div class="flex justify-between items-center mb-8">
                    <h3 class="font-black uppercase tracking-widest text-sm">Fluxo de Caixa Mensal</h3>
                </div>
                <div class="h-80">
                    <canvas id="mainChart"></canvas>
                </div>
            </div>

            <!-- Metas -->
            <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 class="font-black uppercase tracking-widest text-sm mb-6">Metas Ativas</h3>
                <div class="space-y-6">
                    <?php 
                    $stmt = $pdo->prepare("SELECT * FROM goals WHERE userId = ? LIMIT 3");
                    $stmt->execute([$userId]);
                    while($goal = $stmt->fetch()):
                        $progresso = ($goal['currentAmount'] / $goal['targetAmount']) * 100;
                    ?>
                        <div class="space-y-2">
                            <div class="flex justify-between text-xs font-bold">
                                <span><?= $goal['title'] ?></span>
                                <span><?= round($progresso) ?>%</span>
                            </div>
                            <div class="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div class="h-full bg-emerald-500" style="width: <?= $progresso ?>%"></div>
                            </div>
                        </div>
                    <?php endwhile; ?>
                </div>
            </div>
        </div>
    </main>
</div>

<script>
    const ctx = document.getElementById('mainChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Fluxo',
                data: [1200, 1900, 3000, 5000, 2300, 3400],
                borderColor: '#10b981',
                borderWidth: 4,
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(16, 185, 129, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { display: false },
                x: { grid: { display: false } }
            }
        }
    });
</script>

<?php 
function renderStatCard($title, $value, $color, $icon) {
    $val = is_numeric($value) ? formatarMoeda($value) : $value;
    echo "
    <div class='bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm'>
        <p class='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2'>$title</p>
        <h4 class='text-2xl font-black text-{$color}-600 dark:text-{$color}-400'>$val</h4>
    </div>";
}
include 'includes/footer.php'; 
?>
<?php
/**
 * Finanzo Pro - Configuração Global
 * @author Ricardo Costa | Inforric Nexus
 */

session_start();

// Configurações do Banco de Dados
define('DB_HOST', 'localhost');
define('DB_NAME', 'finanzopro');
define('DB_USER', 'root');
define('DB_PASS', '');

// API Key (Será injetada pelo ambiente)
define('GEMINI_API_KEY', getenv('API_KEY') ?: '');

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERR_MODE, PDO::ERR_MODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Em produção, ocultar detalhes do erro
    die("Erro na conexão com o banco de dados: " . $e->getMessage());
}

// Helpers do Sistema
function formatarMoeda($valor) {
    return "R$ " . number_format($valor, 2, ',', '.');
}

function getSaudeFinanceira($pdo, $userId) {
    // Lógica simplificada para cálculo de score local
    $stmt = $pdo->prepare("SELECT type, SUM(amount) as total FROM transactions WHERE userId = ? GROUP BY type");
    $stmt->execute([$userId]);
    $data = $stmt->fetchAll();
    
    $receita = 0; $despesa = 0;
    foreach($data as $row) {
        if($row['type'] == 'INCOME') $receita = $row['total'];
        else $despesa = $row['total'];
    }
    
    if($receita == 0) return 0;
    return round(max(0, min(100, (1 - ($despesa / $receita)) * 100)));
}
?>
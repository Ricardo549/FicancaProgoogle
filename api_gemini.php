<?php
/**
 * Finanzo Pro - Gemini AI Bridge
 */
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode(['error' => 'Metodo não permitido']));
}

$input = json_decode(file_get_contents('php://input'), true);
$prompt = $input['prompt'] ?? 'Analise minhas finanças brevemente.';

$apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=" . GEMINI_API_KEY;

$data = [
    "contents" => [
        ["parts" => [["text" => $prompt]]]
    ],
    "generationConfig" => [
        "temperature" => 0.7,
        "maxOutputTokens" => 800,
        "responseMimeType" => "application/json"
    ]
];

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode(['error' => 'Erro na API Gemini', 'code' => $httpCode]);
    exit;
}

$result = json_decode($response, true);
$text = $result['candidates'][0]['content']['parts'][0]['text'] ?? '{}';

echo $text; // Retorna o JSON gerado pela IA
?>
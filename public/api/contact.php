<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body) {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false]);
}

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    respond(503, ['ok' => false]);
}

$config = require $configPath;
$token = $config['telegram_bot_token'] ?? '';
$chatId = $config['telegram_chat_id'] ?? '';
if (!is_string($token) || !is_string($chatId) || $token === '' || $chatId === '') {
    respond(503, ['ok' => false]);
}

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
    respond(400, ['ok' => false]);
}

function clean($value, int $limit): string {
    $value = is_string($value) ? trim($value) : '';
    return mb_substr(strip_tags($value), 0, $limit);
}

$name = clean($payload['name'] ?? '', 120);
$grade = clean($payload['grade'] ?? '', 80);
$goal = clean($payload['goal'] ?? '', 250);
$message = clean($payload['message'] ?? '', 1500);

if ($name === '' || $message === '') {
    respond(422, ['ok' => false]);
}

$text = "Новая заявка с сайта MzissanaEnglish\n\n"
    . "Имя: {$name}\n"
    . "Класс: " . ($grade ?: 'не указан') . "\n"
    . "Цель: " . ($goal ?: 'не указана') . "\n\n"
    . "Сообщение:\n{$message}";

$curl = curl_init("https://api.telegram.org/bot{$token}/sendMessage");
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query(['chat_id' => $chatId, 'text' => $text]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
]);
$result = curl_exec($curl);
$status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
$curlErrorCode = curl_errno($curl);
$curlError = curl_error($curl);
curl_close($curl);

if ($result === false || $status < 200 || $status >= 300) {
    respond(502, [
        'ok' => false,
        'telegram_status' => $status,
        'telegram_connection_error_code' => $curlErrorCode,
        'telegram_connection_failed' => $result === false && $curlError !== '',
    ]);
}

respond(200, ['ok' => true]);

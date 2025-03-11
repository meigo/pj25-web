<?php
$env = parse_ini_file(filename: '.env');

$apiKey = $env['BREVO_API_KEY'];
$listId = (int) $env['BREVO_LIST_ID'];
$url = "https://api.brevo.com/v3/contacts";

// Get POST data
$input = json_decode(json: file_get_contents(filename: 'php://input'), associative: true);
$email = filter_var(value: $input['email'] ?? '', filter: FILTER_SANITIZE_EMAIL);

if (!$email || !filter_var(value: $email, filter: FILTER_VALIDATE_EMAIL)) {
  http_response_code(response_code: 400);
  echo json_encode(value: ['error' => 'Valid email is required']);
  exit;
}

$data = [
    'email' => $email,
    "listIds" => [$listId], // Add to specific list
    "updateEnabled" => false // Set to true if you want to update existing contacts
];

$headers = [
    "accept: application/json",
    "api-key: $apiKey",
    "content-type: application/json"
];

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_TIMEOUT, 10); // Set timeout (10 seconds)

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

curl_close($ch);

if ($curlError) {
    echo json_encode(["success" => false, "error" => "cURL Error: $curlError"]);
    exit;
}

$responseData = json_decode($response, true);

// Check if request was successful or if it's a "duplicate_parameter" error
if ($httpCode >= 200 && $httpCode < 300) {
  echo json_encode(["success" => true, "message" => "Contact added to the list!", "data" => $responseData]);
} elseif (isset($responseData['code']) && $responseData['code'] === "duplicate_parameter") {
  echo json_encode(["success" => true, "message" => "Contact already exists in the list.", "data" => $responseData]);
} else {
  echo json_encode(["success" => false, "error" => "API Error", "httpCode" => $httpCode, "details" => $responseData], JSON_PRETTY_PRINT);
}

// if ($httpCode >= 200 && $httpCode < 300) {
//     http_response_code(response_code: 200);
//     echo json_encode(["success" => true, "message" => "Contact added to the list!", "data" => $responseData]);
// } else {
//     http_response_code(response_code: 400);
//     echo json_encode(["success" => false, "error" => "API Error", "httpCode" => $httpCode, "details" => $responseData], JSON_PRETTY_PRINT);
// }

?>

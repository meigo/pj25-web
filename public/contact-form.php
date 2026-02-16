<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require '../../../vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // H o n e y p o t check
    if (!empty($_POST["email"])) {
        // Silently fail for bots
        http_response_code(200);
        exit;
    }

    $email = filter_var(trim($_POST["liame"] ?? ''), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(trim($_POST["message"] ?? ''), ENT_QUOTES, 'UTF-8');

    if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL) && !empty($message)) {
        try {
            $mail = new PHPMailer();
            // $mail->SMTPDebug = 4; 

            $to = "info@jaanituli.ee"; // Change this to your email

            $emailParts = explode('@', $email);
            $name = ucfirst($emailParts[0]);
            $subject = "Sõnum Pühajärve jaanitule veebilehelt";
            $mailLink = "<a href='mailto:" . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "'>" . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "</a>";

            $mail->isSMTP();
            $mail->Host = 'localhost';
            $mail->Port = 25;
            $mail->SMTPAuth = false;
            $mail->SMTPSecure = false;
            $mail->SMTPAutoTLS = false;
            $mail->setFrom($email, $name);
            $mail->addAddress($to, 'Jaanitule kontaktmeil');
            $mail->CharSet = 'utf-8';
            $mail->isHTML(true);
            $mail->Subject = $subject;

            $mail->Body = "<html><body>
            <p><strong>Saatja:</strong> $mailLink</p>
            <p><strong>Sõnum:</strong></p>
            <p>" . nl2br($message) . "</p>
            </body></html>";

            $mail->AltBody ="Saatja: $email\n\nSõnum:\n $message\n";

            if ($mail->send()) {
                http_response_code(200);
            } else {
                http_response_code(400);
                // Do not echo PHPMailer error info to the client in production
                error_log($mail->ErrorInfo);
                echo "Viga sõnumi saatmisel.";
            }
        } catch (Exception $e) {
            http_response_code(400);
            error_log($e->getMessage());
            echo "Tekkis viga.";
        }
    } else {
        http_response_code(403);
        echo "Palun sisesta korrektne e-posti aadress ja sõnum.";
    }
} else {
    http_response_code(response_code: 405);
    echo "Vale meetod";
}

?>

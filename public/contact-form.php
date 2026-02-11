<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require '../../../vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim(string: $_POST["email"]);
    $message = trim(string: $_POST["message"]);

    if (!empty($email) && !empty($message)) {
        try {
            $mail = new PHPMailer();
            // $mail->SMTPDebug = 4;

            $to = "kontakt@jaanituli.ee"; // Change this to your email

            $emailParts = explode(separator: '@', string: $email);
            $name = ucfirst(string: $emailParts[0]);

            $allowedSubjects = [
                "suggest-artist" => "Artisti soovitus Pühajärve jaanitulele",
            ];

            $subject = "Sõnum Pühajärve jaanitule veebilehelt";
            if (!empty($_POST["subject"]) && isset($allowedSubjects[$_POST["subject"]])) {
                $subject = $allowedSubjects[$_POST["subject"]];
            }
            $mailLink = "<a href='mailto:$email'>$email</a>";

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
            <p>$message</p>
            </body></html>";

            $mail->AltBody ="Saatja: $email\n\nSõnum:\n $message\n";

            if ($mail->send()) {
                http_response_code(response_code: 200);
            } else {
                http_response_code(response_code: 400);
                echo $mail->ErrorInfo;
            }
        } catch (Exception $e) {
            http_response_code(response_code: 400);
            echo $e->getMessage();
        }
    } else {
        http_response_code(response_code: 403);
        echo "Kõik väljad peavad olema täidetud";
    }
} else {
    http_response_code(response_code: 405);
    echo "Vale meetod";
}

?>

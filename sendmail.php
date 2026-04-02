<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize input
    $name    = strip_tags(trim($_POST['name']));
    $email   = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $mobile  = strip_tags(trim($_POST['mobile']));
    $subject_input = strip_tags(trim($_POST['subject']));
    $message = strip_tags(trim($_POST['message']));

    $to = 'patawaran771@gmail.com';
    $email_subject = "Contact Form: " . ($subject_input ? $subject_input : "New Inquiry");
    
    // Email Headers
    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Construct Email Body
    $email_body = "You have received a new message.\n\n".
                  "Name: $name\n".
                  "Email: $email\n".
                  "Phone: $mobile\n".
                  "Subject: $subject_input\n\n".
                  "Message:\n$message";

    if (mail($to, $email_subject, $email_body, $headers)) {
        echo "Thank you for your message. We will get back to you soon!";
    } else {
        echo "Error: There was a problem sending your message. Please try again.";
    }
} else {
    echo "Access Denied.";
}
?>
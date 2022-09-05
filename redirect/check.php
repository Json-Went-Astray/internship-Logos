<?php
    if ($_SERVER['HTTP_REFERER'] == "http://localhost:3000/redirect/index.html") {
        header("Location: http://localhost:3000/redirect/final.html");
        exit();
    } else {
        header("Location: http://localhost:3000/redirect/index.html");
        exit(); //Stop running the script
        // go to form page again.
    }
?>
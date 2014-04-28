<?php
  	$name = $email = $mobile = "";

	if ($_SERVER["REQUEST_METHOD"] == "POST") {
	    $name = test_input($_POST["name"]);
	    $email = test_input($_POST["email"]);
	    $mobile = test_input($_POST["mobile"]);
    }

	function test_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
	}

	echo 'name: ' . $name . ' ' . 'email: ' . $email . ' ' . 'mobile: ' . $mobile;
?>
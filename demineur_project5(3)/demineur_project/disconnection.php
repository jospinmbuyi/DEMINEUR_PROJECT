<?php
session_start(); // initialisation session

session_unset(); // desactivation de la session
session_destroy(); //detruire session
setcookie('log', '', time()-3444, '/', null, false, true);

header('location: ../');


?>
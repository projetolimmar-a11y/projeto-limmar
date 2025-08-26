<?php
function json_input() {
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
return is_array($data) ? $data : [];
}


function validate_cpf_format($cpf) {
// Accepts 11 digits or formatted xxx.xxx.xxx-xx
$digits = preg_replace('/\D/', '', $cpf);
return strlen($digits) === 11;
}
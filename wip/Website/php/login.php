<?php
$con = mysql_connect("localhost","550202_ttws","usafa2014");

if (!$con){
    die('Could not connect: ' . mysql_error());
}

mysql_select_db("ttws_zzl_userdata", $con);
 
$uid  = mysql_real_escape_string($_POST['u']); // sanitised input
$pass = md5($_POST['p']); // already safe due to md5()

$sql    = 'SELECT * FROM login WHERE UID="'.$uid.'" AND Pass="'.$pass.'"';
$result = mysql_query($sql);

if (mysql_num_rows($result) <= 0) { 
	echo "error"; 
} else { 
	$row = mysql_fetch_array($result);
	echo $row['UID'];
}

mysql_close($con);
?>
<?php
$con = mysql_connect("localhost","550202_ttws","usafa2014");

if (!$con){
	die('Could not connect: ' . mysql_error());
}

mysql_select_db("ttws_zzl_gamedata", $con);

$cmd     = $_POST["cmd"];
$uid     = $_POST["uid"];
$score   = $_POST["score"];
$caption = $_POST["caption"];
$vote    = $_POST["vote"];

if ($cmd == "new"){
	mysql_query("INSERT INTO room1 VALUES ('$uid','$score','$caption','$vote')");
}

if ($cmd == "update"){
	mysql_query("UPDATE room1 SET Score = '$score' WHERE UID = '$uid'");
	mysql_query("UPDATE room1 SET Caption = '$caption' WHERE UID = '$uid'");
	mysql_query("UPDATE room1 SET Vote = '$vote' WHERE UID = '$uid'");
}

if ($cmd == "signoff"){
	mysql_query("DELETE FROM room1 WHERE UID = '$uid'");
}

if ($cmd == "getdata"){
	$result = mysql_query("SELECT * FROM room1");
	while($row = mysql_fetch_array($result)){
		echo $row['UID'] . ":" . $row['Score'] . ":" . $row['Caption'] . ":" . $row['Vote'] . "::";
	}
}

mysql_close($con);
?> 
<?php

	$Type   = $_POST["Type"];
	$Room   = $_POST["Room"];
	$Room .= ".chatlog";
	$Str    = $_POST["Str"];

	if (isset($Type)) {
		if ($Type == "Push") {
			writeChatFile($Room, $Str);
			$chatLog = pullChatMessage($Room);
			ajaxBack($chatLog);
		} elseif ($Type == "Pull") {
			$chatLog = pullChatMessage($Room);
			ajaxBack($chatLog);
		}
	}

	function ajaxBack($infoback){
		$data = array(
			"ChatLog" => $infoback,
		);
		echo json_encode($data);
	}

	function writeChatFile($Room, $content){
		if (file_exists($Room)) {
			if (endsWith($content,"sudo clear")) {
				unlink($Room);
			} else {
				$theFile = fopen($Room, 'a');
			}
		} else {
			$theFile = fopen($Room, 'w');
		}
		fwrite($theFile, $content."\n\n");
		fclose($theFile);
	}

	function pullChatMessage($Room){
		if (file_exists($Room)) {
			$thefile = fopen("$Room", "r");
			$theContent = fread($thefile, filesize("$Room"));
			fclose($thefile);
			return $theContent;
		} else {
			return "";
		}
	}

	function endsWith($haystack, $needle)
	{
		$length = strlen($needle);

		return $length === 0 || 
		(substr($haystack, -$length) === $needle);
	}

?>
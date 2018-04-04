$(document).ready(function () {

	var room = "Public";

	superResize();
	setInterval(pullInfo, 500);

	$(window).resize(function() {
  		superResize();
	});

	function superResize(){
		var browserSize = {
			width: $(window).width(),
			height: $(window).height()
		};

		if (browserSize.width>browserSize.height) {
			$("#chatPanel").css({"margin-left": (browserSize.width - browserSize.height) / 2,
			"width": browserSize.height});
		} else {
			$("#chatPanel").css({"margin-left": 0,
			"width": browserSize.width});
		}
	}

	$('#comment').keydown(function(event) {
		if (event.keyCode == 13){
			if (!event.ctrlKey) {
				submit()
				return false;
			}
			$('#comment').val($('#comment').val() + '\n');
		}
	});

	$("#sendBtn").on("click", function(evt) {
		evt.preventDefault();
		submit();
	});

	$("#btn_public").on("click", function(evt) {
		evt.preventDefault();
		changeRoom("Public");
	});

	$("#btn_private").on("click", function(evt) {
		evt.preventDefault();
		changeRoom("Private");
	});

	function changeRoom(arg1){
		if (arg1=="Public") {
			room="Public";
			$("#btn_public").addClass("active");
			$("#btn_private").removeClass("active");
			$("#chatPanelHeading").html("公共频道 / Public Chat");
		} else {
			room = prompt("Enter a room name:");
			if (room == null || room == "") {
				changeRoom("Public");
			}
			$("#btn_public").removeClass("active");
			$("#btn_private").addClass("active");
			$("#chatPanelHeading").html("私有频道 / Private Chat - " + room);
		}
	}

	function submit(){
		if ($("#alias").val() == "" || $("#comment").val() == "") {
			window.alert("昵称和内容不能为空！");
		} else {
			pushInfo($("#alias").val(), $("#comment").val());
        	$("#comment").val('');
        }
	}

	function pullInfo(){
		var newMessage = {
			Type: "Pull",
			Room: room,
			Str: "None",
		};

		$.ajax({
			url: "helloPHP.php",
			type: "POST",
			data: newMessage,
			dataType: "JSON",
			success: function (jsonStr) {
				updateText(jsonStr.ChatLog);
			},
			error: function(xhr, desc, err) {
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});
	}

	function pushInfo(alias,content){
		var newMessage = {
			Type: "Push",
			Room: room,
			Str: createLine(alias, content, getTime()),
		};

		console.log(newMessage);

		$.ajax({
			url: "helloPHP.php",
			type: "POST",
			data: newMessage,
			dataType: "JSON",
			success: function (jsonStr) {
				updateText(jsonStr.ChatLog);
			},
			error: function(xhr, desc, err) {
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
			}
		});

	}

	function updateText(strings){
		if ($("#display").val() != strings) {
			$("#display").val(strings);
			$('#display').scrollTop($('#display')[0].scrollHeight);
		}
	}

	function createLine(name, content, time){
		return name + " @ " + time + " : \n" + content;
	}

	function getTime(){
		var d = new Date(),
		minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
		hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
		ampm = d.getHours() >= 12 ? 'pm' : 'am',
		months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
		days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm;
	}
});
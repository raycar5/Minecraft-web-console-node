var socket = io(IP_OF_THE_SERVER);

var commandHistory = [];
var historyIndex = 0;
var serverActive = false;
socket.on("output",addLineToOutput);
socket.on("serverStatus",(data)=>{
	switch(data){
		case "started":
			$("#start").text("stop");
			serverActive = true;
			break;
		case "stopped":
			$("#start").text("start");
			serverActive = false;
			break;
	}
})

$("#submit").click(()=>{
	if(serverActive){
		socket.emit("input",$("#input").val());
		addLineToOutput($("#input").val());
		commandHistory.push($("#input").val());
		historyIndex = commandHistory.length-1;
		$("#input").val("");
	}else{
		alert("server inactive please press start");
	}
});
$("#input").keydown((event)=>{
	if(event.which === 13){
		event.preventDefault();
		if(serverActive){
			socket.emit("input",$("#input").val());
			addLineToOutput($("#input").val());
			commandHistory.push($("#input").val());
			historyIndex = commandHistory.length-1;
			$("#input").val("");
		}else{
			alert("server inactive please press start");
		}
	}else if(event.which === 38 && commandHistory.length !== 0){
		if($("#input").val() != ""){
			commandHistory.push($("#input").val());
		}
		$("#input").val(commandHistory[historyIndex--]);
		if(historyIndex <0) historyIndex = 0;
	}else if(event.which === 40 && commandHistory.length !== 0 && historyIndex < commandHistory.length-2){
		$("#input").val(commandHistory[++historyIndex]);
	}
});

$("#start").click(()=>{
	if(serverActive){
		socket.emit("stopServer");
	}else{
		socket.emit("startServer");
	}
});

function addLineToOutput(data){
	var atBottom = isAtScrollBottom()
	var lines = data.split(/(?:\r\n|\r|\n)/g);
	if(lines.length>1)
		lines.pop();
	for(var line of lines){
		$("#output").append("<span/><br/>");
		$("#output").children().last().prev().text(line);
	}
	if (atBottom) {
        window.scrollTo(0,document.body.scrollHeight);
    }
}

function isAtScrollBottom(){
	// document.body.scrollTop alone should do the job but that actually works only in case of Chrome.
	// With IE and Firefox it also works sometimes (seemingly with very simple pages where you have
	// only a <pre> or something like that) but I don't know when. This hack seems to work always.
	var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

	// Grodriguez's fix for scrollHeight:
	// accounting for cases where html/body are set to height:100%
	var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;

	// >= is needed because if the horizontal scrollbar is visible then window.innerHeight includes
	// it and in that case the left side of the equation is somewhat greater.
	return (scrollTop + window.innerHeight) >= scrollHeight;
}

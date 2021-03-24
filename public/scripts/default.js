var socket=io();
//dropZone Start
socket.on('addimage', function (data, image) {
    $('#conversation').append
     (
       $('<p>').append($('<b>').text(data + ': '), '<a href="' + image + '">' + '<img src="' + image + '"/></a>'));
});
socket.on('addfile', function (data, base64file) {
    $('#conversation').append($('<p>').append($('<b>').text(data + ': '), '<a href="' + base64file + '">Attachment File</a>'));
});
//dropZone end



$(document).ready(function(){
socket=io.connect('http://localhost:3000');
socket.on('connect', addUser);
socket.on('updatechat', processMessage);
socket.on('updateusers', updateUserList);
$('#dataSend').click(sendMessage);
$('#data').keypress(processEnterPress);

//dropZone Start
$('#dropZone').on('dragover', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
    });
    dropZone.addEventListener('drop', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.dataTransfer.files;
        for (var i = 0, file; file = files[i]; i++) {
            if (file.type.match(/image.*/)) {
                var reader = new FileReader();
                reader.onload = function (evt) {
                    socket.emit('sendimage', evt.target.result);
                };
                reader.readAsDataURL(file);
                $('#dropZone').val('');
            }
            else {
                var reader = new FileReader();
                reader.onload = function (evt) {
                    socket.emit('sendfile', evt.target.result);
                };
                reader.readAsDataURL(file);
                $('#dropZone').val('');
            }
        }
    });
});

//dropZone end


function addUser(){
 var name= prompt("What is your name?");
 socket.emit('adduser', name);
navigator.geolocation.getCurrentPosition(function(position){
var lat=position.coords.latitude;
var lon=position.coords.longitude;
socket.emit('sendchat', name+'&#39;s Latitude : '+ lat.toFixed(4)+ '& Longitude : '+ lon.toFixed(4));
 $('#data').focus();
}) 
};




function processMessage(username,data){
$('#conversation').append($('<p>').append($('<b>').text(username+': '), '<span>'+data+'</span>'));
}

function updateUserList(data){
$('#users').empty();
$.each(data, function(key, value){
$('#users').append('<div>'+key+'</div>');
});
}

function sendMessage(){
var message=$('#data').val();
$('#data').val('');
socket.emit('sendchat',message);
$('#data').focus();

}

function processEnterPress(e){
if(e.which==13){
e.preventDefault();
$(this).blur();
$('#dataSend').focus().click();
}
}
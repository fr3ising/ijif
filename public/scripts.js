
function loadLog(){  
    var oldscrollHeight = $("#chatbox").attr("scrollHeight") - 20; //Scroll height before the request  
    $.ajax({  
        url: "/chatDisplay",
        cache: true,
        ifModified: true,
        success: function(html){
            $("#chatbox").html(html);
        },  
    });  
}  

$("#submitmsg").click(
    function(){  
	var message = $("#message").val();
	$("#message").val('');
	$("#message").attr("value", "");  
	$.post("/postChat",{message:message});
	loadLog();
	return false;  
    });  


// window.onblur=lostfocus;

// function lostfocus(e) {
//     setInterval (loadLog, 100000*10);
// }

setInterval (loadLog, 3000*1);
loadLog();


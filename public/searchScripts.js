function adjustContainerHeight(_height) {
    $("#offers").animate({ height: _height}, 6000);
}

function searchScript(q) {  
    $("#offers").html('<br/><img src="downloading.gif"/>');
    $.ajax({  
        url: "/search",
	method: "GET",
	data: { q:q },
	dataType: 'html',
        cache: true,
        ifModified: true,
        success: function(html){
	    $("#offers").html(html);
	    adjustContainerHeight($("#offers").height);
        }  
    });  
}

function payScript(q) {  
    $("#pays").html('<br/><img src="downloading.gif"/>');
    $.ajax({  
        url: "/pay",
	method: "GET",
	data: { q:q },
	dataType: 'html',
        cache: true,
        ifModified: true,
        success: function(html){
	    $("#pays").html(html);
        }  
    });  
}

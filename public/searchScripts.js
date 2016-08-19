function searchScript(q){  
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
        }  
    });  
}

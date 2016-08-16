function searchScript(q){  
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

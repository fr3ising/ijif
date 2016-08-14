function searchScript(q){  
    $.ajax({  
        url: "/search",
	data: { "q":q },
        cache: true,
        ifModified: true,
        success: function(html){
            $("#offers").html(html);
        },  
    });  
}  

function searchScript(q){  
    $.ajax({  
        url: "/searchDisplay",
	data: { "q":q },
        cache: true,
        ifModified: true,
        success: function(html){
            $("#offers").html(html);
        },  
    });  
}

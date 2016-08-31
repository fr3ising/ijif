$('.nav li').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
})


function moreOffers(p) {  
    $.ajax({  
        url: "/offers",
	method: "GET",
	data: { p:p },
	dataType: 'html',
        cache: true,
        ifModified: true,
        success: function(html){
	    $("#offers").append(html);
	    $("#offset").val = p+1;
	    adjustContainerHeight($("#offers").height);
        }  
    });  
}


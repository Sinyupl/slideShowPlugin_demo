$(document).ready(function() {
    $('.background').foggy({
    	blurRadius: 8
    });
    
    $("#share_button").click(function(){
    	$(".share_cover").show();
    });
    $(".share_cover").click(function(){
    			$(this).hide();
    });
    var src =  'url(' + $(".background>img").attr("src") + ')';
    $(".code").css({
    	"background-image" : src
    });
});       
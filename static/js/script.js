 $(document).ready(function () {

 $(function () {
        $(".graph_body").hide();
        $("#large_button").show();
    });
    
 $(function () {
        $("#large_button").on("click", function () {
            $(".headin_para").hide();
            $("#large_button").hide();
            $(".graph_body").fadeIn(600);
            
           $(".content_container").removeClass("background").addClass("background-alt");
        });
    });

    
    
}); 
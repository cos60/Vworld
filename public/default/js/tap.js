function showOrHidden(a){
    var num = $(a).parent('li').index();
    var content_one = $('.content-one');
    var li = $(a).parent('li');
    var ul = li.parent('ul');
    li.children(a).addClass("active");
    li.siblings().children(a).removeClass("active");



    //alert(ul.children('a').eq(num).text())
    var orther = $(a).parent('li').siblings();
    content_one.eq(num).css({"display":"block","z-index":1200});
    content_one.eq(num).css({"display":"block","z-index":1200})
    content_one.eq(num).siblings().css({"display":"none","z-index":10})
}
$(function () {
    var Width = $(window).width();
    if(Width<769){

        $('.left-nav').css({"position":"fixed","left":"-155px"});
        $('.left-nav').removeClass('col-md-3');
    }
    $(window).resize(function(){
        var Height = $(window).height();
        var Width = $(window).width();
        if(Width<769){

            $('.left-nav').css({"position":"fixed","left":"-155px"});
            $('.left-nav').removeClass('col-md-3');
            $('.nav-list').click(function () {
                $('.left-nav').css({"position":"fixed","left":"-155px"});
                $('.nav-shoWButton').css({"display":"block"});
                $('.nav-shoWButtonX').css({"display":"none"});
                $('.model-content').css({"left":"0px"});
            })
        }
        else {
            $('.left-nav').css({"position":"relative","left":"0px"});
            $('.left-nav').addClass('col-md-3');
        }

    })
});

$(document).ready(function() {
    var lastX = 0;
    $("body").mousemove(function(e) {
        if (lastX > e.pageX) {
            $("#dirSpan").text("←");
        } else if (lastX < e.pageX) {
            $("#dirSpan").text("→");
        } else {
            $("#dirSpan").text("—");
        }
        lastX = e.pageX;
    });
});
$(document).ready(function() {
    $('.nav-shoWButton').click(function () {
        $('.left-nav').css({"position":"fixed","left":"0"});
        $('.nav-shoWButton').css({"display":"none"});
        $('.nav-shoWButtonX').css({"display":"block"});
        $('.model-content').css({"left":"155px"});
    })
    $('.nav-shoWButtonX').click(function () {
        $('.left-nav').css({"position":"fixed","left":"-155px"});
        $('.nav-shoWButton').css({"display":"block"});
        $('.nav-shoWButtonX').css({"display":"none"});
        $('.model-content').css({"left":"0px"});
    })



});
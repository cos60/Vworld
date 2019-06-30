$('#searchID').focus(function () {

    $(document).keydown(function (e) {
        //var liNum = $('.search-list>li').length;
        e = e || window.event;
        switch (e.keyCode) {
            case 38:
                Up();
                break;//上
            case 40:
                Down();
                break;//下
        }
    })
})

function Down(){
    var liNum = $('.search-list>li').length;
    //console.log(liNum);
    if(liNum ===1){
        $('.search-list>li').eq(0).addClass('active');
        $('#searchID').val($('.search-list>li').eq(0).text())
    }else if(liNum >1) {
        for (var i=0;i<liNum;i++){
            if($('.search-list>li').eq(i).hasClass('active')){
                var index = $('.search-list>li').eq(i).index();
            }
        }
        console.log(index);
        if(index ===undefined){
            $('.search-list>li').eq(0).addClass('active');
            $('#searchID').val($('.search-list>li').eq(0).text())
        }
        else if(index ===liNum-1){
            $('.search-list>li').eq(liNum-1).removeClass('active')
            $('.search-list>li').eq(0).addClass('active');
            $('#searchID').val($('.search-list>li').eq(0).text())
        }else {
            $('.search-list>li').eq(index+1).siblings().removeClass('active')
            $('.search-list>li').eq(index+1).addClass('active');
            $('#searchID').val($('.search-list>li').eq(index+1).text())
            // $('.search-list>li').eq(index-1).siblings().removeClass('active')
        }

    }
}
function Up() {
    var liNum = $('.search-list>li').length;
    //alert(liNum);
    if(liNum==1){
        var index = 0;
    }else {
        for (var i=0;i<liNum;i++){
            if($('.search-list>li').eq(i).hasClass('active')){
                var index = $('.search-list>li').eq(i).index();
            }
        }
    }

   console.log(index)
    if(index==undefined){
        $('.search-list>li').eq(0).addClass('active');
        $('#searchID').val($('.search-list>li').eq(1).text())
    }
    if(index==liNum-1){
        $('.search-list>li').eq(index-1).addClass('active');
        $('#searchID').val($('.search-list>li').eq(index-1).text())
        $('.search-list>li').eq(index-1).siblings().removeClass('active')
    }
    $('.search-list>li').eq(index-1).addClass('active');
    $('#searchID').val($('.search-list>li').eq(index-1).text())
    $('.search-list>li').eq(index-1).siblings().removeClass('active')
}



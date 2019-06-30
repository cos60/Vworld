var api = {
    findUser:function (el,collectionName,attr) {
        if(attr==''){
            $('#usernamelabel').html('请输入用户名');
            $('#usernamelabel').css({"color":"red"});
        }
        else {
            $.get('/login/findUser',{collectionName:collectionName,attr:attr},function (data) {
                if (data.success) {
                    $('#usernamelabel').html(data.message);
                    $('#usernamelabel').css({"color":"#6ce26c"});
                }else{
                    $('#usernamelabel').html(data.message);
                    $('#usernamelabel').css({"color":"red"});
                }
            })
        }

    },



    searchList(value,collectionName){
        $('.search-list').css({"display":"block","z-index":7777})

        a=value;
        setTimeout(
            function () {
                var b = a;

                    $.get('/api/searchList',{value:value,collectionName:collectionName},function (data) {
                        if (data.success) {
                            console.log(data.searchResult.length);
                            $('.search-list').html('')
                            for(var i=0;i<data.searchResult.length;i++){
                               var li = "<li>"+data.searchResult[i].title+"</li>"
                                $('.search-list').append(li)
                           }


                        }else{
                        }
                    })
            },300

        )


    }

}



function panduan() {
    var user_Name = $('#user_Name');
    var user_Email = $('#user_Email');
    var user_Password = $('#user_Password');
    var PhoneNumber = $('#PhoneNumber');
    var user_Submit = $('#user_Submit');
    if(user_Name.val() && user_Email.val() && user_Password.val() && PhoneNumber.val() ){
        return true;
    }else{
        alert('请将表单填写完整')
        return false

    }
}

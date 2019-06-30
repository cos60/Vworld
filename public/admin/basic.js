$(function () {
    app.deleteCollection()
})

var app = {
    toggle:function (el,collectionName,attr,id) {
        if(confirm("确认修改吗？")){
            $.get('/admin/changeStatus',{collectionName:collectionName,attr:attr,id:id},function (data) {
                if (data.success) {
                    /*alert($(el).hasClass('btn-success'))*/
                    if ($(el).hasClass('btn-success')) {
                        $(el).removeClass("btn-success");
                        $(el).addClass("btn-danger");
                        $(el).children("i").removeClass("icon-ok");
                        $(el).children("i").addClass("icon-remove");
                    } else {
                        $(el).removeClass("btn-danger");
                        $(el).addClass("btn-success");
                        $(el).children("i").removeClass("icon-remove");
                        $(el).children("i").addClass("icon-ok");
                    }
                }
            })
        }
    },
    deleteCollection:function(){
        $(".delete").click(function(){
            var flag = confirm("确定要删除吗？");
            return flag;
        })
    },
    changeSort:function (el,collectionName,attr,value,id) {

            $.get('/admin/changeSort',{collectionName:collectionName,attr:attr,value:value,id:id},function (data) {
                if (data.success) {

                }
            })

    },


}
/**
 * Created by Administrator on 2018/3/20 0020.
 */
var router = require('koa-router')();

var DB=require('../../model/db.js');

router.get('/',async (ctx)=>{
    var result= await DB.find('admin',{});
    await ctx.render('admin/manage/list',{
        list:result
    });
})
router.get('/add',async (ctx)=>{
    await  ctx.render('admin/manage/add');
})
router.post('/doAdd',async (ctx)=>{
    var username = ctx.request.body.username;
    var password = ctx.request.body.password;
    var rpassword = ctx.request.body.rpassword
    var result = await DB.find("admin",{"username":username});
    if(result.length>0){
        ctx.render('admin/error',{
            message:'用户名已存在',
            redirect: '/admin/manage/add'
        })
    }else if(password != rpassword){
        ctx.render('admin/error',{
            message:'两次密码输入不一致',
            redirect: '/admin/manage/add'
        })
    }
    else {
        await DB.insert("admin",{
            "username":username,
            "password":password,
            "status":"1",
            "last_time":null
        })
        ctx.redirect("/admin/manage")
    }

})
router.get('/edit',async (ctx)=>{
    var id = ctx.query.id;
    var result = await DB.find("admin",{"_id":DB.getObjectId(id)})
    ctx.render('admin/manage/edit',{
        list:result[0]
    })
})
router.post('/doEdit',async (ctx)=>{
    var username = ctx.request.body.username;
    var password = ctx.request.body.password;
    var rpassword = ctx.request.body.rpassword;
    var result = await DB.find('admin',{"username":username})
    if(password!=rpassword){
        ctx.render('admin/error',{
            message:'两次密码输入不一致',
            redirect: '/admin/manage/edit?id='+result[0]._id
        })
    }else {
        DB.update('admin',{"username":username},{
            "password":password
        })
        ctx.redirect("/admin/manage")
    }

})


module.exports=router.routes();
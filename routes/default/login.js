var router = require('koa-router')();
var DB = require('../../model/db');
var tools = require('../../model/tools.js');
var nodemail = require('../../model/nodemail');
router.get('/',(ctx)=>{
    if(ctx.session.userinformations===null ||ctx.session.userinformations ==undefined){
        ctx.render('default/login');
    }else {
        ctx.redirect('/')
    }

})

router.post('/doLogin',async (ctx)=>{

    var username = ctx.request.body.username;
    var password = ctx.request.body.password;
    var result=await DB.find('user',{"user_name":username,"password":password});

    if(result.length>0){

        //console.log('成功');
        ctx.session.userinformations=result[0];
        ctx.redirect('/');
    }else{
        //console.log('失败');
        ctx.render('admin/error',{
            message:'用户名或者密码错误',
            redirect: '/login'
        })

    }
})

router.get('/register',async (ctx)=>{
    ctx.render('default/register')
})
router.post('/doRegister',async (ctx)=>{


    console.log(ctx.request.body);

    var username = ctx.request.body.username;
    var password = ctx.request.body.password;
    var code = ctx.request.body.code;
    var result =await DB.find('user',{"user_name":username});
    console.log(result);
    var nowDate = (new Date()).getTime();
    console.log(nowDate);
    // console.log(result[0].date.getTime());
    if(result[0].code===code && (result[0].date.getTime()) - nowDate <600000){
        await DB.update('user',{user_name:username},{
            "password":password,
            "status":1,
            "add_time":tools.getTime()
        });
        ctx.redirect('/');
    }else{

        ctx.render('admin/error',{
            message:'验证码出错',
            redirect: 'register'
        })

    }

});
router.get('/loginOut',async (ctx)=>{
    ctx.session.userinformations = null;
    ctx.redirect('/');
});

module.exports=router.routes();

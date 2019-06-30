var router = require('koa-router')();
var DB = require('../../model/db');
var tools = require('../../model/tools.js');
router.get('/',(ctx)=>{
    if(ctx.session.agencyinformations){
        ctx.redirect('/agency')
    }else {
        ctx.render('default/agencyLogin');
    }

})
router.get('/agencyLogin',async (ctx)=>{

    ctx.render('default/agencyLogin');

})

router.post('/doAgencyLogin',async (ctx)=>{
    var username = ctx.request.body.username;
    var password = ctx.request.body.password;
    var result=await DB.find('user',{"user_name":username,"password":password,"role":2});
    if(result.length>0){

        //console.log('成功');
        ctx.session.agencyinformations=result[0];
        ctx.redirect('/agency',{

        });

    }else{
        //console.log('失败');
        ctx.render('admin/error',{
            message:'用户名或者密码错误',
            redirect: '/login',
        })

    }
})
router.get('/register',async (ctx)=>{
    ctx.render('default/register')
})
router.post('/doRegister',async (ctx)=>{
    var username = ctx.request.body.username;
    var password = ctx.request.body.password;
    var result =await DB.find('user',{"user_name":username});

    if(result.length>0){
        ctx.render('admin/error',{
            message:'用户名存在',
            redirect: '/login/register'
        })
    }else{
        await DB.insert('user',{
            "user_name":username,
            "password":password,
            "status":1,
            "add_time":tools.getTime()
        });
        ctx.redirect('/');
    }

});
router.get('/agencyLoginOut',async (ctx)=>{
    console.log(ctx.session.agencyinformations);
    ctx.session.agencyinformations = null;
    ctx.redirect('/agencyLogin');
});
module.exports=router.routes();

var router  = require('koa-router')();
var router = require('koa-router')();

//引入模块
var url=require('url');
const ueditor = require('koa2-ueditor');

router.use(async (ctx,next)=>{

    var pathname=url.parse(ctx.request.url).pathname.substring(1);
    var splitUrl = pathname.split('/')
    ctx.state.G={
        defaultUrl:splitUrl,
        userinformations:ctx.session.userinformations,
        agencyinformations:ctx.session.agencyinformations,
        prevPage:ctx.request.headers['referer']
    }
    await  next();
    // //权限判断
    // if(ctx.session.userinfo){
    //
    // }else{  //没有登录跳转到登录页面
    //     if(pathname=='admin/login' || pathname=='admin/login/doLogin'  || pathname=='admin/login/code'){
    //         await  next();
    //     }else{
    //         ctx.redirect('/admin/login');
    //     }
    // }


})






var index = require('./default/index')
var login = require('./default/login');
var agencyLogin = require('./default/agencyLogin');
var views= require('./default/views');
var Myroom =require('./default/Myroom');
var agency = require('./default/agency')

var travel = require('./default/travel')




router.use(index)
router.use('/agency',agency);
router.use('/login',login);
router.use('/agencyLogin',agencyLogin);
router.use('/views',views);
router.use('/Myroom',Myroom);
router.use('/travel',travel);

router.all('/editor/controller', ueditor(['public', {
    "imageAllowFiles": [".png", ".jpg", ".jpeg"],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))


module.exports=router.routes();

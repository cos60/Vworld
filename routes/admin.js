var router = require('koa-router')();

//引入模块
var url=require('url');
const ueditor = require('koa2-ueditor');
//配置中间件 获取url的地址
router.use(async (ctx,next)=>{


    //模板引擎配置全局的变量
    //ctx.state.__HOST__='http://'+ctx.request.header.host;

    var pathname=url.parse(ctx.request.url).pathname.substring(1);
    var splitUrl = pathname.split('/')
    ctx.state.G={
        url:splitUrl,
        userinfo:ctx.session.userinfo,
        prevPage:ctx.request.headers['referer']

    }

    //权限判断
    if(ctx.session.userinfo){
        await  next();
    }else{  //没有登录跳转到登录页面
        if(pathname=='admin/login' || pathname=='admin/login/doLogin'  || pathname=='admin/login/code'){
            await  next();
        }else{
            ctx.redirect('/admin/login');
        }
    }


})


var api = require('./api.js')
var index=require('./admin/index.js');
var login=require('./admin/login.js');
var user=require('./admin/user.js');
var manage=require('./admin/manage.js');
var articlecate=require('./admin/articlecate.js');
var article=require('./admin/article.js');
var focus = require('./admin/focus.js');
var link = require('./admin/link.js');
var nav = require('./admin/nav.js');
var setting = require('./admin/setting.js');
var panovr = require('./admin/panovr.js');
var panoVideo = require('./admin/panoVideo.js');
var views = require('./admin/views');

router.use(index);
// router.use(api);
router.use('/login',login);
router.use('/user',user);
router.use('/manage',manage);
router.use('/articlecate',articlecate)
router.use('/article',article);
router.use('/focus',focus);
router.use('/link',link);
router.use('/nav',nav);
router.use('/setting',setting);
router.use('/panovr',panovr);
router.use('/panoVideo',panoVideo);
router.use('/views',views);
//注意上传图片的路由   ueditor.config.js配置图片post的地址

router.all('/editor/controller', ueditor(['public', {
    "imageAllowFiles": [".png", ".jpg", ".jpeg"],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))

module.exports=router.routes();
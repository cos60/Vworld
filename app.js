//引入 koa模块
var Koa=require('koa'),
    router = require('koa-router')(),
    path=require('path'),
    render = require('koa-art-template'),
    static = require('koa-static'),
    session = require('koa-session'),
    jsonp = require('koa-jsonp'),
    bodyParser = require('koa-bodyparser'),
    sd = require('silly-datetime')
    cors = require('koa2-cors');
//实例化
var app=new Koa();

//配置jsonp的中间件
app.use(jsonp());

//配置post提交数据的中间件
app.use(bodyParser());

//配置session的中间件

app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',
    maxAge: 8640000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true,   /*每次请求都重新设置session*/
    renew: false,
};
app.use(cors({
        origin: function (ctx) {
            // 这里用 headers 和 header 属性皆可
            return ctx.header.origin;
        }
}))
app.use(session(CONFIG, app));

//配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat:dateFormat = function (value) {
        return sd.format(new Date(value),'YYYY-MM-DD HH:mm')
    }
});
//配置 静态资源的中间件
app.use(static(__dirname + '/public'));
app.use(static( '.'));

var index = require('./routes/index.js');
var api=require('./routes/api.js');
var admin=require('./routes/admin.js');

router.use(index);
router.use('/admin',admin);
router.use('/api',api);
app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());

app.listen(8081);
// app.listen(3000,"192.168.0.113",function(err){
//     if(err){
//         console.error(err);
//     }else {
//         console.info("服务器起动成功..");
//     }
// });

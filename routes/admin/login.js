/**
 * Created by Administrator on 2018/3/20 0020.
 */
const router = require('koa-router')();

const tools = require('../../model/tools.js');

const DB = require('../../model/db.js');

//验证码模块
var svgCaptcha = require('svg-captcha');


router.get('/',async (ctx)=>{
    await ctx.render('admin/login');
})

//post
router.post('/doLogin',async (ctx)=>{



    //首先得去数据库匹配

    let username=ctx.request.body.username;

    let password=ctx.request.body.password;

    let code=ctx.request.body.code;

    //console.log(tools.md5(password));

    //1、验证用户名密码是否合法

    //2、去数据库匹配

    //3、成功以后把用户信息写入sessoin

    if(code.toLocaleLowerCase()==ctx.session.code.toLocaleLowerCase()){

        //后台也要验证码用户名密码是否合法



        var result=await DB.find('admin',{"username":username,"password":password});

        if(result.length>0){

            //console.log('成功');


            ctx.session.userinfo=result[0];

            /*更新用户表*/
            await DB.update('admin',{"_id":DB.getObjectId(result[0]._id)},{
                last_time:new Date()
            })

            ctx.redirect('/admin');
        }else{
            //console.log('失败');
            ctx.render('admin/error',{
                message:'用户名或者密码错误',
                redirect: '/admin/login'
            })

        }
    }else{
        ctx.render('admin/error',{
            message:'验证码失败',
            redirect: '/admin/login'
        })
    }

})

router.get('/loginOut',async (ctx)=>{
    ctx.session.userinfo = null;
    ctx.redirect('admin/login');
});
/*验证码*/
router.get('/code',async (ctx)=>{
    var captcha = svgCaptcha.create({
        size:4,
        fontSize: 50,
        width: 120,
        height:34,
        background:"#cc9966"
    });
    //console.log(captcha.text);

    //保存生成的验证码
    ctx.session.code=captcha.text;
    //设置响应头
    ctx.response.type = 'image/svg+xml';
    ctx.body=captcha.data;
})



module.exports=router.routes();
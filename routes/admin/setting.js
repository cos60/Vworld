/**
 * Created by Administrator on 2018/3/20 0020.
 */
var router = require('koa-router')();
var multer = require('koa-multer');
var DB=require('../../model/db.js');

var tools=require('../../model/tools.js');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload/focus');   /*配置图片上传的目录     注意：图片上传的目录必须存在*/
    },
    filename: function (req, file, cb) {   /*图片上传完成重命名*/
        var fileFormat = (file.originalname).split(".");   /*获取后缀名  分割数组*/
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
var upload = multer({ storage: storage });

router.get('/',async (ctx)=>{

    //ctx.body='系统设置';
    //获取设置的信息

    var result=await DB.find('setting',{});
    await ctx.render('admin/setting/index',{
        list:result[0]
    });

})


router.post('/doEdit',upload.single('site_logo'),async (ctx)=>{

    //ctx.body='系统设置';
    //获取设置的信息

    var site_title=ctx.req.body.site_title;
    let site_logo=ctx.req.file? ctx.req.file.path.substr(7).replace(/\\/g,'/') :'';
    var site_keywords=ctx.req.body.site_keywords;
    var site_description=ctx.req.body.site_description;
    var site_icp=ctx.req.body.site_icp;
    var site_qq=ctx.req.body.site_qq;
    var site_tel=ctx.req.body.site_tel;
    var site_address=ctx.req.body.site_address;
    var site_status=ctx.req.body.site_status;
    var add_time=tools.getTime();


    if(site_logo){
        var json={
            site_title,site_logo,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,site_status,add_time

        }
    }else{
        var json={
            site_title,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,site_status,add_time

        }

    }

    await  DB.update('setting',{},json);
    ctx.redirect('/admin/setting');

})



module.exports=router.routes();
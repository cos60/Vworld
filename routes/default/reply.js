var router = require('koa-router')();
var multer = require('koa-multer');
var DB=require('../../model/db.js');
var tools=require('../../model/tools.js');
var url = require('url');
var DB = require('../../model/db.js')



//配置图片上传koa-multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload/panovr');   /*配置图片上传的目录     注意：图片上传的目录必须存在*/
    },
    filename: function (req, file, cb) {   /*图片上传完成重命名*/
        var fileFormat = (file.originalname).split(".");   /*获取后缀名  分割数组*/
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
var upload = multer({ storage: storage });


router.get('/',async (ctx)=>{

    await ctx.render('default/reply',{

    })
})

router.post('/doReply',upload.single('pic'),async (ctx)=>{

    //var business_license = ctx.request.body.business_license;
    var enterprise_name = ctx.req.body.enterprise_name;
    var qq = ctx.req.body.qq;
    var phone = ctx.req.body.phone;
    var id = ctx.req.body.id;
    var business_license = ctx.req.file? ctx.req.file.path.substr(7):'';
    var role=2;
    //console.log(ctx.req.file);

    var add_time = new Date();

    var json = {
        business_license:business_license,
        enterprise_name:enterprise_name,
        qq:qq,
        phone:phone,
        role:2
    }

    var json1 = {
        pid:id,
        agency_imgurl:"",
        business_license:business_license,
        enterprise_name:enterprise_name,
        qq:qq,
        phone:phone,
        add_time:add_time

    }
    var result = await DB.update('user',{"_id":DB.getObjectId(id)},json);
    await DB.insert('agency',json1);



    ctx.body = {
        result:result,
        enterprise_name:enterprise_name
    }




})
module.exports=router.routes();



var router = require('koa-router')();
var multer = require('koa-multer');
var DB=require('../../model/db.js');
var tools=require('../../model/tools.js');
var url = require('url');
var DB = require('../../model/db.js');


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
    if(ctx.session.agencyinformations===null || ctx.session.agencyinformations===undefined) {
        //console.log(ctx.session.agencyinformations);
            ctx.redirect('/agencyLogin');
    }else {

        var id =  ctx.session.agencyinformations._id;
        //var id2 = await DB.find('agency',{pid:id});
        var views = await DB.find('views',{$or:[{"status":1},{"status":'1'}],},{},{sortJson:{end_time:1}});

        var message = await DB.find('agency',{pid:id});
        var id2 = await message[0]._id;

        console.log(id2);
        var activity = await DB.find('activity',{
            $or:[{"status":1},{"status":'1'}],
                author:id2.toString()
        },
            {})
        console.log(activity);

        await ctx.render('default/agency', {
            views: views,
            activity: activity,
            message:message[0]
        })


        /* 这里要实现一下参与人数*/



    }


})

router.post('/updateAgenctImg',upload.single('agency_imgurl'),async (ctx)=>{
    //console.log(123123123)
   // console.log(ctx.request.body);
})
router.get('/share',async (ctx)=>{

    ctx.render('default/agency',{

    });
})
router.get('/detail',async (ctx)=>{
    var id = ctx.query.id;
    var result = await DB.find('activity',{_id:DB.getObjectId(id)});
    var formData = await DB.find('entryForm',{"pid":id});

    // var enrollDB = await DB.find('enroll',{pid:id});
    await ctx.render('default/agencyDetail',{
        activity:result[0],
        formData:formData
    })

});



router.post('/doAdd',upload.single('pic'),async (ctx)=>{
    //console.log(ctx.req.body);
    var toPlace = ctx.req.body.title;
    var superior = ctx.req.body.number;
    var start_time = ctx.req.body.startTime;
    var end_time = ctx.req.body.endTime;
    var pid = ctx.req.body.pid;
    var author = ctx.req.body.author;
    var description = ctx.req.body.editorValue;
    var status= 1;
    var joinNum = 0;
    var img_url=ctx.req.file? ctx.req.file.path.substr(7).replace(/\\/g,'/') :'';
    var json = {toPlace,superior,start_time,end_time,description,author,pid,status,joinNum,img_url}

    await DB.insert('activity',json);
    await ctx.redirect('/agency')
})




module.exports=router.routes();



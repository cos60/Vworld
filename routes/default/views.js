var router = require('koa-router')();
var multer = require('koa-multer');
var DB=require('../../model/db.js');
var tools=require('../../model/tools.js');
var url = require('url');
var multer = require('koa-multer');
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

    var result = await DB.find('views',{$or:[{"status":1},{"status":'1'}]});

        ctx.render('default/views',{
            views:result
        });
    })
router.get('/viewsDet',async (ctx)=>{


    var id = ctx.query.id;
    var  panorama = await DB.find('panorama',{$or:[{"status":1},{"status":'1'}],"pid":id});
    var  video = await DB.find('panoVideo',{$or:[{"status":1},{"status":'1'}],"pid":id});
    var  views = await DB.find('views',{
        $or:[{"status":1},{"status":'1'}],
        '_id':DB.getObjectId(id)
    });
    var activity = await DB.find('activity',{$or:[{"status":1},{"status":'1'}],"pid":id});
    var Strategy =await DB.find('Strategy',{$or:[{"status":1},{"status":'1'}],"pid":id});
    ctx.render('default/viewsDet',{
        panorama:panorama,
        views:views[0],
        Strategy:Strategy,
        activity:activity,
        video:video
    });
})
router.get('/viewsDet/strategy',async (ctx)=>{
    var id = ctx.query.id;
    var strategy = await DB.find('Strategy',{_id:DB.getObjectId(id)});
    console.log(strategy);
    ctx.render('default/strategy',{
        strategy:strategy[0]
    });
})
router.post('/addpanorama',upload.single('pic'),async (ctx)=>{



    let title = ctx.req.body.title;
    let addr ="";
    let pid = ctx.req.body.pid;
    let genre = "";
    let genreId = "";
    let see=0;
    let like = 0;
    let description = ctx.req.body.description;
    let status = 1;
    let add_time =tools.getTime();
    var img_url=ctx.req.file? ctx.req.file.path.substr(7).replace(/\\/g,'/') :'';
    let author = ctx.req.body.author;
    var json = {title,description,add_time,status,img_url,author,addr,genreId,genre,pid,see,like}
    DB.insert('panorama',json)
    ctx.redirect(ctx.state.G.prevPage)





})
router.post('/addvideo',upload.single('video'),async (ctx)=>{



    let title = ctx.req.body.title;
    let addr ="";
    let pid = ctx.req.body.pid;
    let genre = "";
    let genreId = "";
    let see=0;
    let like = 0;
    let description = ctx.req.body.description;
    let status = 1;
    let add_time =tools.getTime();
    var video_url=ctx.req.file? ctx.req.file.path.substr(7).replace(/\\/g,'/') :'';
    let author = ctx.req.body.author;
    var json = {title,description,add_time,status,video_url,author,addr,genreId,genre,pid,see,like}
    DB.insert('panoVideo',json)
    ctx.redirect(ctx.state.G.prevPage);
})
router.get('/join',async (ctx)=>{
    var id = ctx.query.id;
    var count = await DB.find('entryForm',{"pid":id},{});

    var activity = await DB.find('activity',{"_id":DB.getObjectId(id)});
    var result = activity[0].author;
    //console.log(author);
    var author = await DB.find('agency',{'_id':DB.getObjectId(result)},{enterprise_name:1})
    console.log(author);
    // console.log(activity);
    ctx.render('default/join',{
        activity:activity[0],
        count:count.length,
        author:author[0]
    })



})
router.get('/addActivity',async (ctx)=>{

    var userName = ctx.query.userName;
    var phone = ctx.query.qqNumber;
    var idCard = ctx.query.idCard;
    var pid = ctx.query.pid;
    var toPlace = ctx.query.toPlace;
    var joiner = ctx.query.joiner;
    var add_time = new Date();
    var json = {userName,phone,idCard,pid,toPlace,add_time,joiner};
    var result = await DB.insert('entryForm',json);
    if(result){
        ctx.body = {"message":"您已经成功参与","success":true}
    }else{
        ctx.body = {"message":"参与失败","success":false}
    }



})
router.post('/dojoin',upload.single('pic'),async (ctx)=>{
    let title = ctx.req.body.title;
    let addr ="";
    let pid = ctx.req.body.pid;
    let genre = "";
    let genreId = "";
    let see=0;
    let like = 0;
    let description = ctx.req.body.description;
    let status = 1;
    let add_time =tools.getTime();
    var img_url=ctx.req.file? ctx.req.file.path.substr(7).replace(/\\/g,'/') :'';
    let author = ctx.req.body.author;
    var json = {title,description,add_time,status,img_url,author,addr,genreId,genre,pid,see,like}
    DB.insert('panorama',json)
    ctx.redirect(ctx.state.G.prevPage)





})
router.get('/showVr',async (ctx)=>{
    var url = ctx.request.url;
    var id = ctx.query.id;
    var panoList = await DB.find('panorama',{_id:DB.getObjectId(id)});
    var see = panoList[0].see;

    see++;

    await DB.update('panorama',{_id:DB.getObjectId(id)},{
         "see":see
     })
    await ctx.render('default/panorama/showVR',{
        url:url,
        panoList:panoList[0]
    })

})
router.get('/vrVedio',async (ctx)=>{
    var url = ctx.request.url;
    var id = ctx.query.id;
    var panoList = await DB.find('panoVideo',{_id:DB.getObjectId(id)});
    var see = panoList[0].see;

    see++;

    await DB.update('panoVideo',{_id:DB.getObjectId(id)},{
        "see":see
    })
    await ctx.render('default/panorama/vrVedio',{
        url:url,
        panoList:panoList[0]
    })

})
router.post('/addStrategy',upload.single('pic'),async (ctx)=>{
    var title = ctx.req.body.title;
    var editorValue = ctx.req.body.editorValue;
    var pid = ctx.req.body.pid;
    var author = ctx.req.body.author;
    var img_url=ctx.req.file? ctx.req.file.path.substr(7).replace(/\\/g,'/') :'';

    await DB.insert('Strategy',{
        title:title,
        pid:pid,
        strategycontent:editorValue,
        add_time: tools.getTime(),
        status:1,
        see:0,
        like:0,
        img_url:img_url,
        author:author
    })
    ctx.redirect(ctx.state.G.prevPage)


})

module.exports=router.routes();



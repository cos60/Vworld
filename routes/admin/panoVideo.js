var router = require('koa-router')();
var DB=require('../../model/db.js');
var multer = require('koa-multer');
var tools = require('../../model/tools.js');



//配置图片上传koa-multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload/panoVideo');   /*配置video上传的目录     注意：video上传的目录必须存在*/
    },
    filename: function (req, file, cb) {   /*图片上传完成重命名*/
        var fileFormat = (file.originalname).split(".");   /*获取后缀名  分割数组*/
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
var upload = multer({ storage: storage });

router.get('/',async (ctx)=>{
    var page = ctx.query.page ||  1;
    var pageSize = 5;
    var count = await DB.count('panoVideo',{});
    var result = await DB.find('panoVideo',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            'add_time':-1
        }
    });
    await ctx.render('admin/panoVideo/index',{
        list:result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
    });
})
router.get('/add',async (ctx)=>{
    var genreList = await DB.find('panoGenre',{});
    await  ctx.render('admin/panoVideo/add',{
        genreList:genreList
    });
})

router.post('/doAdd',upload.single('video'),async (ctx)=>{
    console.log(ctx.req.body);
    let title = ctx.req.body.title;
    let addr = ctx.req.body.addr;
    let genre = ctx.req.body.genreName;
    let see = 0;
    let like = 0;
    let genreId = ctx.req.body.genreId;
    let description = ctx.req.body.description;
    let status = ctx.req.body.status;
    let add_time =tools.getTime();
    var video_url=ctx.req.file? ctx.req.file.path.substr(7).replace(/\\/g,'/') :'';
    let author = ctx.req.body.author;
    var json = {title,description,add_time,status,video_url,author,addr,genreId,genre,see,like};
    DB.insert('panoVideo',json);
    ctx.redirect('/admin/panoVideo')
})
router.get('/edit',async (ctx)=>{
    var id = ctx.query.id;
    var prevPage = ctx.state.G.prevPage;
    // console.log(id);
    //var catelist = await DB.find('panovr',{})
    var result = await DB.find("panovr",{"_id":DB.getObjectId(id)})
    ctx.render('admin/panovr/edit',{
        list:result[0],
        prevPage:prevPage
    })
})
router.post('/doEdit',upload.single('pic'), async (ctx)=>{
    let id = ctx.req.body.id;
    let prevPage = ctx.req.body.prevPage;
    let title = ctx.req.body.title;
    let url = ctx.req.body.url;
    let description = ctx.req.body.description;
    let add_time =tools.getTime();
    var img_url=ctx.req.file? ctx.req.file.path:'';
    console.log(img_url);
    let status = ctx.req.body.status;
    if(img_url!=''){
        var json = {title,status,description,img_url,url}
    }else{
        var json = {title,status,description,url}
    }

    DB.update('panovr',{_id:DB.getObjectId(id)},json)
    ctx.redirect(prevPage)


})


//注意上传图片的路由   ueditor.config.js配置图片post的地址

module.exports=router.routes();
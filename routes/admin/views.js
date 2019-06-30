var router = require('koa-router')();
var DB=require('../../model/db.js');
var multer = require('koa-multer');
var tools = require('../../model/tools.js');



//配置图片上传koa-multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload/views');   /*配置图片上传的目录     注意：图片上传的目录必须存在*/
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
    var count = await DB.count('views',{});
    var result = await DB.find('views',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            'add_time':-1
        }
    });
    await ctx.render('admin/views/index',{
        list:result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
    });
})
router.get('/add',async (ctx)=>{
    await  ctx.render('admin/views/add',{
    });
});

router.post('/doAdd',upload.single('pic'),async (ctx)=>{
    console.log(ctx.req.body);
    let title = ctx.req.body.title;
    // let addr = ctx.req.body.addr;

    let hot=0;
    let see = 0;
    let description = ctx.req.body.description;
    let editorValue = ctx.req.body.editorValue;
    let status = ctx.req.body.status;
    let add_time =tools.getTime();
    var img_url=ctx.req.file? ctx.req.file.path.substr(7).replace(/\\/g,'/') :'';
    let author = ctx.req.body.author;
    var json = {title,description,editorValue,add_time,status,img_url,author,hot,see}
    DB.insert('views',json)
    ctx.redirect('/admin/views')
})
router.get('/edit',async (ctx)=>{
    var id = ctx.query.id;

    var prevPage = ctx.state.G.prevPage;

    var result = await DB.find("views",{"_id":DB.getObjectId(id)});

    //console.log(result);
    ctx.render('admin/views/edit',{
        id:id,
        list:result[0],
        prevPage:prevPage
    })
})
router.get('/strategy',async (ctx)=>{
    var id = ctx.query.id;
    console.log(id)

    var prevPage = ctx.state.G.prevPage;

    var result = await DB.find("Strategy",{"pid":id});
console.log(result)
    //console.log(result);
    ctx.render('admin/views/strategy',{
        result:result
    })
})
router.post('/doEdit',upload.single('pic'), async (ctx)=>{
    let id = ctx.req.body.id;
    console.log(id);
    let prevPage = ctx.req.body.prevPage;
    var img_url=ctx.req.file? ctx.req.file.path.substr(7).replace(/\\/g,'/') :'';
    let title = ctx.req.body.title;
    // let addr = ctx.req.body.addr;
    let hot=0;
    let description = ctx.req.body.description;
    let editorValue = ctx.req.body.editorValue;
    let status = ctx.req.body.status;
    let add_time =tools.getTime();
    var img_url=ctx.req.file? ctx.req.file.path.substr(7).replace(/\\/g,'/') :'';
    let author = ctx.req.body.author;

    if(img_url!=''){
        var json = {title,description,editorValue,add_time,status,img_url,author,hot}
    }else{
        var json = {title,description,editorValue,add_time,status,author,hot}
    }

    // await DB.update('views',{"_id":DB.getObjectId(id)},json);
    // await  DB.update('setting',{},json);

    DB.update('views',{_id:DB.getObjectId(id)},json)
    ctx.redirect(prevPage)


})


//注意上传图片的路由   ueditor.config.js配置图片post的地址

module.exports=router.routes();
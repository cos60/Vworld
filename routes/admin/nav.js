var router = require('koa-router')();
var DB=require('../../model/db.js');
var multer = require('koa-multer');
var tools = require('../../model/tools.js');



//配置图片上传koa-multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload/nav');   /*配置图片上传的目录     注意：图片上传的目录必须存在*/
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
    var count = await DB.count('nav',{});
    var result = await DB.find('nav',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            'add_time':-1
        }
    });
    await ctx.render('admin/nav/index',{
        list:result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
    });
})
router.get('/add',async (ctx)=>{
    await  ctx.render('admin/nav/add',{});
})
router.post('/doAdd',upload.single('pic'),async (ctx)=>{
    let tilte = ctx.req.body.tilte;
    let url = ctx.req.body.url;
    let status = ctx.req.body.status;
    let add_time =tools.getTime();


    var json = {tilte,url,add_time,status}

    DB.insert('nav',json)
    ctx.redirect('/admin/nav')
})
router.get('/edit',async (ctx)=>{


    var id = ctx.query.id;
    var prevPage = ctx.state.G.prevPage;

    var result = await DB.find("nav",{"_id":DB.getObjectId(id)})
    ctx.render('admin/nav/edit',{

        list:result[0],
        prevPage:prevPage
    })
})
router.post('/doEdit',upload.single('pic'), async (ctx)=>{
    let id = ctx.req.body.id;
    let prevPage = ctx.req.body.prevPage;
    let title = ctx.req.body.title;
    let url = ctx.req.body.url;
    let status = ctx.req.body.status;

    var json = {title,status,url}


    await DB.update('nav',{_id:DB.getObjectId(id)},json)
    ctx.redirect(prevPage)


})

//注意上传图片的路由   ueditor.config.js配置图片post的地址

module.exports=router.routes();
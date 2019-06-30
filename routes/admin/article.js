var router = require('koa-router')();
var DB=require('../../model/db.js');
var multer = require('koa-multer');
var tools = require('../../model/tools.js');



//配置图片上传koa-multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload');   /*配置图片上传的目录     注意：图片上传的目录必须存在*/
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
    var count = await DB.count('article',{});


    var result = await DB.find('article',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            'add_time':-1
        }
    });
    await ctx.render('admin/article/index',{
        list:result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
    });
})
router.get('/add',async (ctx)=>{
    var result = await DB.find('articlecate',{});
    await  ctx.render('admin/article/add',{
        catelist:tools.cateToList(result)
    });
})
router.post('/doAdd',upload.single('pic'),async (ctx)=>{
    let title = ctx.req.body.title;
    let author = ctx.req.body.author;
    let catename = ctx.req.body.catename;
    let status = ctx.req.body.status? ctx.req.body.status :0;
    let is_new = ctx.req.body.is_new? ctx.req.body.is_new :0;
    let is_hot = ctx.req.body.is_hot? ctx.req.body.is_hot :0;
    let is_best = ctx.req.body.is_best? ctx.req.body.is_best :0;
    let keywords = ctx.req.body.keywords;
    let content = ctx.req.body.editorValue;
    let description = ctx.req.body.description;
    let pid = ctx.req.body.pid;
    let add_time =tools.getTime();
    var img_url=ctx.req.file? ctx.req.file.path :'';
    var json = {title,author,catename,status,is_best,is_hot,is_new,keywords,content,description,pid,img_url,add_time}

    DB.insert('article',json)
    ctx.redirect('/admin/article')
})
router.get('/edit',async (ctx)=>{


    var id = ctx.query.id;
    var prevPage = ctx.state.G.prevPage;
   // console.log(id);
    var catelist = await DB.find('articlecate',{})
    var result = await DB.find("article",{"_id":DB.getObjectId(id)})
    ctx.render('admin/article/edit',{
        list:result[0],
        catelist:tools.cateToList(catelist),
        prevPage:prevPage
    })
})
router.post('/doEdit',upload.single('pic'), async (ctx)=>{
    let prevPage = ctx.req.body.prevPage;
    let id = ctx.req.body.id;
    let title = ctx.req.body.title;
    let author = ctx.req.body.author;
    let catename = ctx.req.body.catename;
    let status = ctx.req.body.status? ctx.req.body.status :0;
    let is_new = ctx.req.body.is_new? ctx.req.body.is_new :0;
    let is_hot = ctx.req.body.is_hot? ctx.req.body.is_hot :0;
    let is_best = ctx.req.body.is_best? ctx.req.body.is_best :0;
    let keywords = ctx.req.body.keywords;
    let content = ctx.req.body.editorValue;
    let description = ctx.req.body.description;
    let pid = ctx.req.body.pid;
    let add_time =tools.getTime();
    var  img_url=ctx.req.file? ctx.req.file.path:'';
    if(img_url!=''){
        var json = {title,author,catename,status,is_best,is_hot,is_new,keywords,content,description,pid,img_url,add_time}
    }else{
        var json = {title,author,catename,status,is_best,is_hot,is_new,keywords,content,description,pid,add_time}
    }

    DB.update('article',{_id:DB.getObjectId(id)},json)
    ctx.redirect(prevPage)


})




//注意上传图片的路由   ueditor.config.js配置图片post的地址

module.exports=router.routes();
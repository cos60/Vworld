var router = require('koa-router')();
var tools = require('../../model/tools.js')
var DB=require('../../model/db.js');

router.get('/',async (ctx)=>{
    var result = await DB.find("articlecate",{})
    await ctx.render('admin/articlecate/index',{
        list:tools.cateToList(result)
    })
})
router.get('/add',async (ctx)=>{
    var result = await DB.find("articlecate",{})
    var catelist = [];
    for(var i=0;i<result.length;i++){
        if (result[i].pid =="0"){
            catelist.push(result[i])
        }
    }
    ctx.render('admin/articlecate/add',{
        catelist:catelist
    })
})
router.post('/doAdd',async (ctx)=>{
    var catelist = ctx.request.body;
    var title = catelist.title;
    var description = catelist.description;
    var keywords = catelist.keywords;
    var status = catelist.status;
    var pid = catelist.pid;
    if(title == "" || keywords==""){
        ctx.render('admin/error',{
            message:'标题为空',
            redirect: '/admin/articlecate/add'
        })
    }else{
        DB.insert("articlecate",catelist);
        ctx.redirect('/admin/articlecate')
    }


})
router.get('/edit',async (ctx)=>{

    var id = ctx.query.id
    var result = await DB.find('articlecate',{
        _id:DB.getObjectId(id)
    });
    var catelist = await DB.find('articlecate',{"pid":"0"})
    await ctx.render('admin/articlecate/edit',{
        list:result[0],
        catelist:catelist
    })

})
router.post('/doEdit',async (ctx)=>{
    var catelist = ctx.request.body;
    console.log(catelist);
    var id = catelist.id;
    var title = catelist.title;
    var description = catelist.description;
    var keywords = catelist.keywords;
    var status = catelist.status;
    var pid = catelist.pid;
    if(title == "" || keywords==""){
        ctx.render('admin/error',{
            message:'标题为空',
            redirect: '/admin/articlecate/add'
        })
    }else{
        DB.update("articlecate",{"_id":DB.getObjectId(id)},{
            "title":title,
            "description":description,
            "status":status,
            "pid":pid,
            "keywords":keywords
        });
        ctx.redirect('/admin/articlecate')
    }
})



module.exports=router.routes();
var router = require('koa-router')();
var multer = require('koa-multer');
var DB=require('../../model/db.js');
var tools=require('../../model/tools.js');
var url = require('url');
var DB = require('../../model/db.js')

router.get('/',async (ctx)=>{
    var id = ctx.state.G.userinformations._id;
    console.log(id);
    var entryForm = await DB.find('entryForm',{joiner:id});
    var userinfo = await DB.find('user',{_id:DB.getObjectId(id)});
    var entryList = [];
    for(var i=0;i<entryForm.length;i++){

        await entryList.push(await DB.find('activity',{_id:DB.getObjectId(entryForm[i].pid)}))

    }
    console.log(entryList);
    ctx.render('default/myroom',{
        views:entryForm,
        entryList:entryList,
        userinfo:userinfo[0]
    });
})
router.get('/share',async (ctx)=>{
    ctx.render('default/agency',{

    });
});
/*router.get('/reply',async (ctx)=>{
    await ctx.render('default/reply',{

    })
})*/
router.get('/showVr',async (ctx)=>{
    var url = ctx.request.url;
    var id = ctx.query.id;
    var panoList = await DB.find('panorama',{_id:DB.getObjectId(id)});
    // var see = panoList[0].see;
    console.log(panoList[0]);
    // console.log(see++);
    // await DB.update('panorama',{_id:DB.getObjectId(id)},{
    //     "see":see
    // })
    await ctx.render('default/panorama/showVR',{
        url:url,
        panoList:panoList[0]
    })

})
router.get('/changeInfo',async (ctx)=>{
    console.log(ctx.query);
    var user_name = ctx.query.user_name;
    var birthday = ctx.query.birthday;
    var phone = ctx.query.phone;
    var qq = ctx.query.qq;
    var id = ctx.query.id;
    var json = {user_name,birthday,phone,qq}
    var rusult = await DB.update('user',{_id:DB.getObjectId(id)},json)
    if(rusult){
        ctx.body = {success:true,message:"成功"}
    }
})


var reply = require('./reply');
router.use('/reply',reply);


module.exports=router.routes();



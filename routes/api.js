/**
 * Created by Administrator on 2018/3/20 0020.
 */
var router = require('koa-router')();
const DB = require('../model/db.js');
const tools = require('../model/tools')
const nodemail = require('../model/nodemail.js');
router.get('/',async (ctx)=>{

    console.log(123);

});

router.get('/searchList',async (ctx)=>{

    // var arr = [{title:'云门山'},{title:'大师傅'}];
    // console.log(arr.toString().indexOf({title:'云门山'}.toString()));

    // console.log(ctx.query);
    var value = ctx.query.value.trim();
    //console.log(value.trim());
    var collectionName = ctx.query.collectionName;
    //console.log(value+collectionName);

    var searchResult = [];
    var result = await DB.find(collectionName,{$or:[{"status":1},{"status":'1'}]});
    //console.log(result);
    for(var i=0;i<result.length;i++){
       // console.log(result[i].title);
       // if( searchResult.toString().indexOf(result[i].toString())===-1 && result[i].title.indexOf(value)>-1){
        if( result[i].title.indexOf(value)>-1){
            await searchResult.push(result[i])
        }else{
            console.log("nonono");
        }
    }

    if(searchResult){
        ctx.body={"message":'查询成功',"success":true,"searchResult":searchResult};
    }else{
        ctx.body={"message":"更新失败","success":false}
    }


});


// router.get('/delete', async (ctx)=>{
//     console.log(ctx.query);
//     var collection = ctx.query.collection
//     var id = ctx.query.id
//     console.log(await DB.remove(collection, {_id:DB.getObjectId(id)}));;
//
//     ctx.body={"message":'删除成功',"success":true};
// })

router.get('/changeStatus',async (ctx)=>{



    var collectionName=ctx.query.collection; /*数据库表*/
    var attr=ctx.query.attr; /*属性*/
    var id=ctx.query.id;   /*更新的 id*/

    var data= await DB.find(collectionName,{"_id":DB.getObjectId(id)});


    if(data.length>0){
        if(data[0][attr]==1){
            var json = { /*es6 属性名表达式*/
                [attr]: 0
            };
        }else{
            var json = {
                [attr]: 1
            };
        }
        let updateResult=await DB.update(collectionName,{"_id":DB.getObjectId(id)},json);

        if(updateResult){
            ctx.body={"message":'更新成功',"success":true};
        }else{
            ctx.body={"message":"更新失败","success":false}
        }

    }else{
        ctx.body={"message":'更新失败,参数错误',"success":false};
    }

})

router.get('/email',async (ctx)=>{
    console.log(ctx.query);




    var email = ctx.query.email;
    var user_name = ctx.query.user_name;
    var code = await tools.createSixNum();
    var date = new Date();

    var result =await DB.find('user',{user_name:user_name});
    //console.log(result);
    if(result.length>0){
        ctx.body ={success:false,message:"账号已经存在"}
    }else{
        ctx.body ={success:true,message:"账号可行"};
        var mail = {
            // 发件人
            from: '<ymwow1331@163.com>',
            // 主题
            subject: '接受凭证',
            // 收件人
            to:email,
            // 邮件内容，HTML格式
            text: '用'+code+'作为你的凭证'//接收激活请求的链接
        };
        var json = {user_name,email,code,date};
        await DB.insert('user',json);
        await nodemail(mail);
    }
})

router.get('/test',async (ctx)=>{
    var a = ctx.query.a;
    var b = ctx.query.b;
    var json = {a}
    ctx.body = {
        success:a+b
    }
    await DB.insert('Facetest',json);

})

module.exports=router.routes();

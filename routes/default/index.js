var router = require('koa-router')();
var DB =require('../../model/db.js')

router.get('/',async (ctx)=>{
    // var panoVideo = await DB.find('panoVideo',{$or:[{"status":1},{"status":'1'}]});
    // //console.log(panoVideo);
    // var  panorama = await DB.find('panorama',{$or:[{"status":1},{"status":'1'}]})
    // var focusResult=await DB.find('focus',{"status":1});
    var views = await DB.find('views',{$or:[{"status":1},{"status":'1'}]})
    ctx.render('default/index',{
        views:views
    });
})
router.get('/search',async (ctx)=>{
    var value = ctx.query.searchValue.trim();

    var views = await DB.find('views',{$or:[{"status":1},{"status":'1'}]});

    var searchResult = [];
    var result = await DB.find('views',{$or:[{"status":1},{"status":'1'}]});
    //console.log(result);
    for(var i=0;i<result.length;i++){
        // console.log(result[i].title);
        // if( searchResult.toString().indexOf(result[i].toString())===-1 && result[i].title.indexOf(value)>-1){
        if( result[i].title.indexOf(value)>-1){
            await searchResult.push(result[i])
        }else{
            console.log("查询不到数据");
        }
    }



    ctx.render('default/search',{
        views:searchResult
    });
});

router.get('/A_search',async (ctx)=>{
    var value = ctx.query.searchValue.trim();

    var views = await DB.find('agency',{$or:[{"status":1},{"status":'1'}]});

    var searchResult = [];
    var result = await DB.find('agency',{$or:[{"status":1},{"status":'1'}]});
    //console.log(result);
    for(var i=0;i<result.length;i++){
        // console.log(result[i].title);
        // if( searchResult.toString().indexOf(result[i].toString())===-1 && result[i].title.indexOf(value)>-1){
        if( result[i].title.indexOf(value)>-1){
            await searchResult.push(result[i])
        }else{
            console.log("查询不到数据");
        }
    }



    ctx.render('default/agency/search',{
        searchResult:searchResult
    });
})

module.exports=router.routes();



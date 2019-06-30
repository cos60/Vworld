/**
 * Created by Administrator on 2018/3/20 0020.
 */
var router = require('koa-router')();


router.get('/',async (ctx)=>{

    await  ctx.render('admin/manage/list');
})


router.get('/add',async (ctx)=>{

    await  ctx.render('admin/manage/add');

})

router.get('/edit',async (ctx)=>{

    ctx.body="编辑用户";

})

router.get('/delete',async (ctx)=>{

    ctx.body="删除用户";

})

module.exports=router.routes();
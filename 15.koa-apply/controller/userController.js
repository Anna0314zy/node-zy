class UserController {
    async add(ctx,next) {
        ctx.body = '用户添加'
        await ctx.render('a',{name:100})
        
    }
    list(ctx,next) {
        ctx.body = '用户列表'
      

    }
}
module.exports = UserController
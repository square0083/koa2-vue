exports.getHome = async(ctx) => {
    await ctx.render('home', {
        title: '主页'
    });
};
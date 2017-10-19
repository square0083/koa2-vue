import Koa from 'koa';
const cors = require('koa-cors');
const compress = require('koa-compress');
const json = require('koa-json');
const views = require('koa-views');
const serve = require('koa-static');
const logger = require('koa-logger');
const convert = require('koa-convert');
const body = require('koa-better-body');

import session from 'koa-session2';
const onerror = require('koa-onerror');
const path = require('path');

import index from './server/routes/index';

const app = new Koa();

onerror(app);

// x-response-time
app.use(async (ctx, next) => {
    await next();
    ctx.set('X-Powered-By', 'Koa2');
});

// 设置gzip
app.use(compress({
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}));

app.use(convert(logger()))

app.use(session({
    maxAge: 1000 * 60 * 60 * 24,
}));

// 设置跨域
app.use(convert(cors()));
// 传输JSON
app.use(convert(json()));
// body解析
app.use(convert(body({
    uploadDir: path.join(__dirname, 'uploads'),
    keepExtensions: true
})));
// 设置渲染引擎
app.use(views(__dirname + '/server/views', {
    extension: 'ejs'
}));

// 设置静态文件夹
app.use(convert(serve(__dirname + '/public/')))

app.use(index.routes());

app.use(async(ctx) => {
    if (ctx.status === 404) {
        await ctx.render('./error/404');
    }
});

app.listen(process.env.PORT || 3000);

console.log(`Server up and running! On port ${process.env.PORT || 3000}!`);

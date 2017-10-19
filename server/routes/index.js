import Router from 'koa-router';
const home = require('../controller/home');

const router = new Router();

router
    .get('/', home.getHome);

export default router;
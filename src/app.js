import dotenv from 'dotenv'
dotenv.config();

import createError from 'http-errors';
import appConfig from './config/config.js';
import paths from './config/paths.js';
import { engine, config } from 'express-edge'
import express from "express";
import logger from 'morgan';
import httpProxy from 'http-proxy';
import path from 'path';
import { readdirSync } from 'fs';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import webpackAssets from 'express-webpack-assets';

const app = express();

config({ cache: process.env.NODE_ENV === 'production' });
app.use(engine);
app.set('views', path.join(paths.__dirname, 'resources'));

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());
app.set('trust proxy', 1);
app.use(cookieSession({
    name: 'session',
    keys: [process.env.SECRET],
    maxAge: 5 * 60 * 1000
}))

app.use(express.static(path.join(paths.__dirname, 'public')));

if(!appConfig.isProd){
    const proxy = httpProxy.createProxyServer();
    app.use(appConfig.publicPath, (req, res, next) => {
        proxy.web(req, res, {target: 'http://localhost:5505/assets'})
    })
}else
    app.use(appConfig.publicPath, express.static(appConfig.distFolder));

app.use(webpackAssets(path.join(paths.__dirname, '../dist/webpack-assets.json')));

app.use('/public', express.static('./src/public'))

const routerFiles = readdirSync(path.join(paths.__dirname, 'routes'))
    .filter(route => route.endsWith('.js'));

await Promise.all(routerFiles.map(async file => {
    const { router } = await import(`./routes/${file}`);
    router.stack.map(stack => {
        if (stack.route.methods.get)
            app.get(stack.route.path, stack.handle)
        else
            app.post(stack.route.path, stack.handle)
    })
}))

app.use((req, res, next) => next(createError(404)));

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {err: err.status});
}); 

app.listen(process.env.PORT || 5005, (err) => {
    console.log(`listening on http://localhost:${process.env.PORT || 5005}`)
});

app.on('error', (err) => {
    console.log(err);
})

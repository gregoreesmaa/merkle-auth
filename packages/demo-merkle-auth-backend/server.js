import koaBody from "koa-body";
import koaRouter from "@koa/router";
import koaCors from "@koa/cors";
import logger from "koa-logger";

import Koa from 'koa';

import jsonpathResource from "./api/jsonpath/resource";
import jsonpathClaims from "./api/jsonpath/claims";
import arrayResource from "./api/array/resource";
import arrayClaims from "./api/array/claims";

const app = new Koa();
const router = koaRouter();

app.use(logger());
app.use(koaBody());
app.use(koaCors());

router.get('/jsonpath/claims', jsonpathClaims.get)
      .get('/jsonpath/resource/single', jsonpathResource.single.get)
      .get('/jsonpath/resource/single2', jsonpathResource.single2.get)
      .get('/jsonpath/resource/multiple', jsonpathResource.multiple.get)
      .get('/jsonpath/resource/multiple2', jsonpathResource.multiple2.get)
      .get('/array/claims', arrayClaims.get)
      .get('/array/resource/single', arrayResource.single.get)
      .get('/array/resource/single2', arrayResource.single2.get)
      .get('/array/resource/multiple', arrayResource.multiple.get)
      .get('/array/resource/multiple2', arrayResource.multiple2.get);

app.use(router.routes());

app.listen(3001);
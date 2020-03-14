import koaBody from "koa-body";
import koaRouter from "@koa/router";
import koaCors from "@koa/cors";
import logger from "koa-logger";

import Koa from 'koa';

import objectResource from "./api/object";
import arrayResource from "./api/array";
import arrayMetaResource from "./api/array-metadata";

const app = new Koa();
const router = koaRouter();

app.use(logger());
app.use(koaBody());
app.use(koaCors());

router.get('/array/claims', arrayResource.claims.get)
      .get('/array/resource/single', arrayResource.single.get)
      .get('/array/resource/single2', arrayResource.single2.get)
      .get('/array/resource/multiple', arrayResource.multiple.get)
      .get('/array/resource/multiple2', arrayResource.multiple2.get)
      .get('/array-meta/claims', arrayMetaResource.claims.get)
      .get('/array-meta/resource/single', arrayMetaResource.single.get)
      .get('/array-meta/resource/single2', arrayMetaResource.single2.get)
      .get('/array-meta/resource/multiple', arrayMetaResource.multiple.get)
      .get('/array-meta/resource/multiple2', arrayMetaResource.multiple2.get)
      .get('/object/claims', objectResource.claims.get)
      .get('/object/resource/single', objectResource.single.get)
      .get('/object/resource/single2', objectResource.single2.get)
      .get('/object/resource/multiple', objectResource.multiple.get)
      .get('/object/resource/multiple2', objectResource.multiple2.get);


app.use(router.routes());

app.listen(6995);
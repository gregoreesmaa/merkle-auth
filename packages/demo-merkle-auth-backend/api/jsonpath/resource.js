import {verify} from "merkle-auth-jsonpath";

function get(ctx, predicate) {
    const {proof, signature} = JSON.parse(Buffer.from(ctx.request.headers['claims-user'], 'base64').toString('binary'));
    const claims = verify(proof, signature, 'ohdude');
    if (predicate(claims)) {
        ctx.body = {"status": "success"};
    } else {
        ctx.throw(403, {"status": "error"});
    }
}

export default {
    single: {
        get: async (ctx) => get(ctx, claims => claims.user.id === 123)
    },
    single2: {
        get: async (ctx) => get(ctx, claims => claims.user.id === 124)
    },
    multiple: {
        get: async (ctx) => get(ctx, claims => claims.user.id === 123 && claims.user.products.includes('1232132'))
    },
    multiple2: {
        get: async (ctx) => get(ctx, claims => claims.user.id === 123 && claims.user.products.includes('1232133'))
    }
}
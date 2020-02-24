import {verify} from "merkle-auth-array";

function get(ctx, predicate) {
    const {proof, signature} = JSON.parse(Buffer.from(ctx.request.headers['claims-user'], 'base64').toString('binary'));
    const claims = verify(proof, signature, 'hesoyam');
    if (predicate(claims)) {
        ctx.body = {"status": "success"};
    } else {
        ctx.throw(403, {"status": "error"});
    }
}

export default {
    single: {
        get: async (ctx) => get(ctx, claims => claims.includes("a"))
    },
    single2: {
        get: async (ctx) => get(ctx, claims => claims.includes("A"))
    },
    multiple: {
        get: async (ctx) => get(ctx, claims => claims.includes("a") && claims.includes("g"))
    },
    multiple2: {
        get: async (ctx) => get(ctx, claims => claims.includes("a") && claims.includes("G"))
    }
}
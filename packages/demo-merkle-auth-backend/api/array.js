import {MerkleAuth} from "merkle-auth";

const merkleAuth = new MerkleAuth({secret: "hesoyam"});

function get(ctx, predicate) {
    const {proof, signature} = JSON.parse(Buffer.from(ctx.request.headers['claims-user'], 'base64').toString('binary'));
    const claims = merkleAuth.verify(proof, signature);
    if (predicate(claims)) {
        ctx.body = {"status": "success"};
    } else {
        ctx.throw(403, {"status": "error"});
    }
}

export default {
    claims: {
        get: async (ctx) => {
            const claims = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s"];
            const {signature} = merkleAuth.sign(claims);
            ctx.body = {claims, signature};
        }
    },
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
import {MerkleAuth} from "merkle-auth";
import {withObjectClaims} from "merkle-auth-object";

const merkleAuth = new MerkleAuth(withObjectClaims({secret: "ohdude"}));

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
            const claims = {
                user: {
                    id: 123,
                    products: ["123", "34234", "1232132", "sdb", "##", "...", "more", "moremore", "moremoremore"],
                    "testing.escaping": "escaping=works"
                }
            };
            const {signature} = merkleAuth.sign(claims);
            ctx.body = {claims, signature};
        }
    },
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
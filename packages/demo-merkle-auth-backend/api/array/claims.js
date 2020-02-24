import {sign} from "merkle-auth-array";

export default {
    async get(ctx) {
        const claims = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s"];
        const signature = sign(claims, "hesoyam");
        ctx.body = {claims, signature};
    }
}
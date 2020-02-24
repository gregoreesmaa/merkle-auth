import {sign} from "merkle-auth-jsonpath";

export default {
    async get(ctx) {
        const claims = {
            user: {
                id: 123,
                products: ["123", "34234", "1232132", "sdb", "##", "...", "more", "moremore", "moremoremore"],
                "testing.escaping": "escaping=works"
            }
        };
        const signature = sign(claims, "ohdude");
        ctx.body = {claims, signature};
    }
}
import {MerkleAuth} from "../merkle-auth";

export function withMetadata({sign = MerkleAuth.defaultSign, ...options} = {}) {
    return {
        ...options,
        payloadToClaims: payload => payload.claims,
        proofToProofTree: proof => proof.tree,
        proofTreeToProof: (proofTree, payload) => ({tree: proofTree, metadata: payload.metadata}),
        sign: (root, secret, {metadata}) => {
            return sign(JSON.stringify({hash: root, metadata}), secret);
        }
        // TODO verify expiry
    }
}

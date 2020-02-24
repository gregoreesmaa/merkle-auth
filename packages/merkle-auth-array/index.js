import {hashTwo} from "merkle-auth-core/hash";
import {buildProofTree, buildTree, calculateHash} from "merkle-auth-core";

export function sign(arr, secret, hashAlgorithm) {
    return hashTwo(hashAlgorithm, fromClaimsArray(arr, true, hashAlgorithm).root.hash, secret);
}

export function verify(proofTree = {}, signature, secret, hashAlgorithm) {
    const claims = [];
    const hash = calculateHash(proofTree, claims, hashAlgorithm);
    if (signature !== hashTwo(hashAlgorithm, hash, secret)) {
        throw new Error("Root hash signature mismatch");
    }
    return claims;
}

export function fromClaimsArray(arr, hashOnly = false, hashAlgorithm) {
    const root = buildTree(arr, hashOnly, hashAlgorithm);
    return hashOnly
           ? {root}
           : {
            root,
            getProof(...claims) {
                return buildProofTree(root, claims)
            }
        };
}
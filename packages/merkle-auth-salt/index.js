import WordArray from "crypto-js/lib-typedarrays"
import {MerkleAuth} from "merkle-auth";

export function withSalt(options = {}) {
    return {
        ...options,
        hashLeaves: (leaves, hashLeaf, signingProperties) => hashLeaves(options, leaves, hashLeaf, signingProperties),
        getSigningProperties: (payload) => getSigningProperties(options, payload, options.saltStrength || 16)
    }
}

const flatMap = (arr, f) =>
    arr.reduce((acc, x, i) => acc.concat(f(x, i)), []);

function hashLeaves(options, leaves, hashLeaf, signingProperties) {
    const superHashLeaves = options.hashLeaves || MerkleAuth.defaultHashLeaves;
    const superHashTwo = options.doHashTwo || MerkleAuth.defaultHashTwo;

    const hashedLeaves = superHashLeaves(leaves, hashLeaf, signingProperties);
    const {salt} = signingProperties;

    // Adds salt together with each leaf, so neighbouring values would be safe from brute-force
    return flatMap(hashedLeaves, (lobj, idx) =>
        [
            lobj,
            {
                leaf: null,
                hash: superHashTwo(superHashTwo(lobj.leaf, idx), salt),
                claims: new Set([])
            }
        ]
    );
}

function getSigningProperties(options, payload, saltStrength) {
    const superGetSigningProperties = options.getSigningProperties || MerkleAuth.defaultGetSigningProperties;

    const salt = WordArray.random(saltStrength).toString();
    return {
        ...superGetSigningProperties(),
        salt
    };
}
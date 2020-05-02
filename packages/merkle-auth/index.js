import sha3 from "crypto-js/sha3";

function buildTree(leafNodes, combineLeftAndRight) {
    const treeLayers = [leafNodes];
    for (let depth = 0; depth < treeLayers.length; depth++) {
        const layer = treeLayers[depth];

        if (layer.length < 2) {
            // If layer has one element, this is the root.
            break;
        }

        const newLayer = [];
        treeLayers.push(newLayer);
        for (let i = 0; i < layer.length; i += 2) {
            const left = layer[i];
            const right = layer[i + 1];
            if (right == null) {
                // move element up the tree when odd number of nodes at this layer.
                newLayer.push(left);
            } else {
                newLayer.push(combineLeftAndRight(left, right));
            }
        }
    }
    const root = treeLayers[treeLayers.length - 1][0];
    return {root};
}

function calculateHashAndCollectLeaves(node, leaves, hashLeaf, hashTwo) {
    if ('v' in node) {
        leaves.push(node.v);
        return hashLeaf(node.v);
    }
    const leftHash = 'l' in node ? calculateHashAndCollectLeaves(node.l, leaves, hashLeaf, hashTwo)
                                 : node.L;
    const rightHash = 'r' in node ? calculateHashAndCollectLeaves(node.r, leaves, hashLeaf, hashTwo)
                                  : node.R;
    return hashTwo(leftHash, rightHash);
}

export function buildProofTree(root, claimsToProve) {
    if (root.leaf) {
        return {v: root.leaf}
    }
    const leftProof = claimsToProve.some(claim => root.left.claims.has(claim))
                      ? {l: buildProofTree(root.left, claimsToProve)}
                      : {L: root.left.hash};
    const rightProof = claimsToProve.some(claim => root.right.claims.has(claim))
                       ? {r: buildProofTree(root.right, claimsToProve)}
                       : {R: root.right.hash};
    return {...leftProof, ...rightProof};
}

export class MerkleAuth {
    constructor({
        secret,
        hashTwo = MerkleAuth.defaultHashTwo,
        hashLeaf = MerkleAuth.defaultHashLeaf,
        sign = MerkleAuth.defaultSign,
        claimsToLeaves = MerkleAuth.defaultClaimsToLeaves,
        leavesToClaims = MerkleAuth.defaultLeavesToClaims,
        provableValuesToClaims = MerkleAuth.defaultProvableValuesToClaims,
        payloadToClaims = MerkleAuth.defaultPayloadToClaims,
        proofToProofTree = MerkleAuth.defaultProofToProofTree,
        proofTreeToProof = MerkleAuth.defaultProofTreeToProof,
        claimsComparator = MerkleAuth.defaultClaimsComparator,
        getSigningProperties = MerkleAuth.defaultGetSigningProperties,
        hashLeaves = MerkleAuth.defaultHashLeaves
    } = {}) {
        this.secret = secret;
        this.doHashTwo = hashTwo;
        this.doHashLeaf = hashLeaf;
        this.doSign = sign;
        this.claimsToLeaves = claimsToLeaves;
        this.leavesToClaims = leavesToClaims;
        this.provableValuesToClaims = provableValuesToClaims;
        this.payloadToClaims = payloadToClaims;
        this.proofToProofTree = proofToProofTree;
        this.proofTreeToProof = proofTreeToProof;
        this.claimsComparator = claimsComparator;
        this.getSigningProperties = getSigningProperties;
        this.hashLeaves = hashLeaves;
    }

    static defaultHashTwo(left, right) {
        return sha3(`${left}${right}`).toString();
    }

    static defaultHashLeaf(claim) {
        return sha3(claim).toString();
    }

    static defaultSign(root, secret) {
        return sha3(`${root}.${secret}`).toString();
    }

    static defaultClaimsToLeaves(claims) {
        return claims;
    }

    static defaultLeavesToClaims(leaves) {
        return leaves;
    }

    static defaultClaimsComparator(a, b) {
        return a < b ? -1
                     : a > b ? 1
                             : 0;
    }

    static defaultProvableValuesToClaims(provableValues, allClaims) {
        return provableValues;
    }

    static defaultPayloadToClaims(payload) {
        return payload;
    }

    static defaultProofToProofTree(proof) {
        return proof;
    }

    static defaultProofTreeToProof(proof, payload) {
        return proof;
    }

    static defaultGetSigningProperties(payload) {
        return {};
    }

    static defaultHashLeaves(leaves, hashLeaf, signingProperties) {
        return leaves.map(leaf => ({
            leaf,
            hash: hashLeaf(leaf),
            claims: new Set([leaf])
        }));
    }

    sign(payload) {
        if (!this.secret) {
            throw new Error("Secret not set, unable to sign");
        }

        const signingProperties = this.getSigningProperties(payload);
        const claims = this.payloadToClaims(payload);
        const leaves = this.claimsToLeaves(claims);
        const orderedLeaves = leaves.sort(this.claimsComparator);
        const orderedHashedLeaves = this.hashLeaves(orderedLeaves, this.doHashLeaf, signingProperties);
        const tree = buildTree(orderedHashedLeaves, (left, right) => ({hash: this.doHashTwo(left.hash, right.hash)}));
        return {
            signature: this.doSign(tree.root.hash, this.secret, payload),
            signingProperties
        };
    }

    verify(proof, expectedSignature) {
        if (!this.secret) {
            throw new Error("Secret not set, unable to verify");
        }

        const leaves = [];
        const rootHash = calculateHashAndCollectLeaves(this.proofToProofTree(proof), leaves, this.doHashLeaf,
            this.doHashTwo);
        const actualSignature = this.doSign(rootHash, this.secret, proof);
        if (actualSignature !== expectedSignature) {
            throw new Error(
                "Root hash signature mismatch. Expected=" + expectedSignature + "; Actual=" + actualSignature);
        }
        return this.leavesToClaims(leaves);
    }

    getProofTree(payload, signingProperties) {
        const claims = this.payloadToClaims(payload);
        const leaves = this.claimsToLeaves(claims);
        const orderedLeaves = leaves.sort(this.claimsComparator);
        const orderedHashedLeaves = this.hashLeaves(orderedLeaves, this.doHashLeaf, signingProperties);
        const proofTree = buildTree(orderedHashedLeaves, (left, right) => ({
            hash: this.doHashTwo(left.hash, right.hash),
            claims: new Set([...left.claims, ...right.claims]),
            left,
            right
        }));
        return {
            ...proofTree,
            getProof: (...provableValues) =>
                this.proofTreeToProof(
                    buildProofTree(proofTree.root, this.provableValuesToClaims(provableValues, claims)),
                    payload)
        }
    }
}

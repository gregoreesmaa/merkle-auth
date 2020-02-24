import {hashOne, hashTwo} from './hash';

export function calculateHash(node, leaves, hashAlgorithm) {
    if ('v' in node) {
        leaves.push(node.v);
        return hashOne(hashAlgorithm, node.v);
    } else if ('l' in node && 'r' in node) {
        return hashTwo(
            hashAlgorithm,
            calculateHash(node.l, leaves, hashAlgorithm),
            calculateHash(node.r, leaves, hashAlgorithm)
        );
    } else if ('l' in node) {
        return hashTwo(
            hashAlgorithm,
            calculateHash(node.l, leaves, hashAlgorithm),
            node.R
        );
    } else if ('r' in node) {
        return hashTwo(
            hashAlgorithm,
            node.L,
            calculateHash(node.r, leaves, hashAlgorithm)
        );
    }
}

export function buildTree(elements, hashOnly, hashAlgorithm) {
    const leafNodes = elements.map(value => ({values: new Set([value]), hash: hashOne(hashAlgorithm, value)}));

    const data = [leafNodes];
    for (let depth = 0; depth < data.length; depth++) {
        const layer = data[depth];

        if (layer.length < 2) {
            // If layer has one element, this is the root.
            break;
        }

        const newLayer = [];
        data.push(newLayer);
        for (let i = 0; i < layer.length; i += 2) {
            const left = layer[i];
            const right = layer[i + 1];
            if (right == null) {
                // move element up the tree when odd number of nodes at this layer.
                newLayer.push(left);
            } else {
                const hash = hashTwo(hashAlgorithm, left.hash, right.hash);
                newLayer.push(
                    hashOnly ? {hash}
                             : {
                            hash,
                            left,
                            right,
                            values: new Set([...left.values, ...right.values])
                        }
                );
            }
        }
    }
    return data[data.length - 1][0];
}

export function buildProofTree(root, values) {
    if (root.values.size > 1) {
        const leftHas = values.some(value => root.left.values.has(value)); // TODO consider flip
        const rightHas = values.some(value => root.right.values.has(value));
        if (leftHas && rightHas) {
            return {l: buildProofTree(root.left, values), r: buildProofTree(root.right, values)};
        } else if (leftHas) {
            return {l: buildProofTree(root.left, values), R: root.right.hash};
        } else if (rightHas) {
            return {L: root.left.hash, r: buildProofTree(root.right, values)};
        }
    } else {
        const [value] = root.values;
        return {v: value}
    }
}
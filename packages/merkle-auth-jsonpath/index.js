import {hashTwo} from "../merkle-auth-core/hash";
import {buildProofTree, buildTree, calculateHash} from "merkle-auth-core";
import jp from "jsonpath";

export function sign(obj, secret, hashAlgorithm) {
    return hashTwo(hashAlgorithm, fromClaimsObj(obj, true, hashAlgorithm).root.hash, secret);
}

export function verify(proofTree = {}, signature, secret, hashAlgorithm) {
    const claims = [];
    const hash = calculateHash(proofTree, claims, hashAlgorithm);
    if (signature !== hashTwo(hashAlgorithm, hash, secret)) {
        throw new Error("Root hash signature mismatch");
    }
    return claimsToObject(claims);
}

const flatMap = (arr, f) =>
    arr.reduce((acc, x) => acc.concat(f(x)), []);

export function fromClaimsObj(obj, hashOnly = false, hashAlgorithm) {
    const claims = objectToClaims(obj);
    const root = buildTree(claims, hashOnly, hashAlgorithm);
    return hashOnly
           ? {root}
           : {
            root,
            getProof(...paths) {
                const claims = flatMap(paths, path => objectToClaims(obj, path));
                return buildProofTree(root, claims)
            }
        };
}

export function objectToClaims(obj, path = '$..*') { // TODO exported only for demonstration purposes
    return jp.nodes(obj, path)
             .filter(({path, value}) =>
                 typeof value === 'string'
                 || typeof value === 'number'
                 || typeof value === 'boolean'
                 || value == null)
             .map(({path, value}) => ({path: jp.stringify(path), value}))
             .map(encodeClaim);
}

function claimsToObject(claims) {
    let obj = {};
    claims.map(decodeClaim)
          .forEach(({path, value}) => jp.value(obj, path, value));
    return obj;
}

function encodeClaim({path, value}) {
    const escapedPath = escape(path);
    const escapedValue = escape(JSON.stringify(value));
    return `${escapedPath}=${escapedValue}`;
}

function decodeClaim(claimStr) {
    const [escapedPath, escapedValue] = claimStr.split(/(?<!\\)=/);
    const path = unescape(escapedPath);
    const value = JSON.parse(unescape(escapedValue));
    return {path, value};
}

function escape(val) {
    return val.replace('=', '\\=')
}

function unescape(val) {
    return val.replace('\\=', '=');
}
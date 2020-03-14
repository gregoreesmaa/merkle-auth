import jp from "jsonpath";

export function withObjectClaims(options = {}) {
    return {
        ...options,
        claimsToLeaves: claims => claimsObjectToLeaves(claims),
        leavesToClaims: leaves => leavesToClaimsObject(leaves),
        provableValuesToClaims: (provableValues, allClaims) => flatMap(provableValues, path => claimsObjectToLeaves(allClaims, path))
    }
}

const flatMap = (arr, f) =>
    arr.reduce((acc, x) => acc.concat(f(x)), []);

function claimsObjectToLeaves(obj, path = '$..*') {
    return jp.nodes(obj, path)
             .filter(({path, value}) =>
                 typeof value === 'string'
                 || typeof value === 'number'
                 || typeof value === 'boolean'
                 || value == null)
             .map(({path, value}) => ({path: jp.stringify(path), value}))
             .map(encodeClaim);
}

function leavesToClaimsObject(claims) {
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
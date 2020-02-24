import sha1 from "crypto-js/sha1";

export function hashOne(hashAlgorithm = sha1, value) {
    return hashAlgorithm(value).toString();
}

export function hashTwo(hashAlgorithm = sha1, one, two) {
    // TODO provide two-argument hashing function support somehow
    return hashAlgorithm(one + two).toString();
}

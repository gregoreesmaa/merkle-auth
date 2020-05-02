import React, {useState} from 'react';
import fetch from 'isomorphic-unfetch';
import {MerkleAuth} from "merkle-auth";
import {withObjectClaims} from "merkle-auth-object";
import {withSalt} from "merkle-auth-salt";

const backend = process.env.BACKEND_URL || "http://localhost:6995";

const arrayMerkleAuth = new MerkleAuth();
const arraySaltMerkleAuth = new MerkleAuth(withSalt());
const objectMerkleAuth = new MerkleAuth(withObjectClaims());

function getArrClaims(setAuthorization) {
    fetch(`${backend}/array/claims`)
        .then(r => r.json())
        .then(res => {
            console.log("Response", res);
            console.log("Building merkle tree from claims", res.claims);
            const proofTree = arrayMerkleAuth.getProofTree(res.claims);
            setAuthorization({...res, proofTree})
        })
        .catch(() => setAuthorization("fail"));
}

function requestArrSingle({proofTree, signature}, setResponse) {
    const proof = proofTree.getProof("a");
    fetchWithProof("array/resource/single", {proof, signature}, setResponse)
}

function requestArrSingleOther({proofTree, signature}, setResponse) {
    const proof = proofTree.getProof("a");
    fetchWithProof("array/resource/single2", {proof, signature}, setResponse)
}

function requestArrMultiple({proofTree, signature}, setResponse) {
    const proof = proofTree.getProof("a", "g");
    fetchWithProof("array/resource/multiple", {proof, signature}, setResponse)
}

function requestArrMultipleOther({proofTree, signature}, setResponse) {
    const proof = proofTree.getProof("a", "g");
    fetchWithProof("array/resource/multiple2", {proof, signature}, setResponse)
}

function requestArrEmptyProof({proofTree, signature}, setResponse) {
    const proof = proofTree.getProof();
    fetchWithProof("array/resource/multiple", {proof, signature}, setResponse)
}

function requestArrNoClaims({proofTree, signature}, setResponse) {
    fetchApi('array/resource/multiple', setResponse)
}

function getArrSaltClaims(setAuthorization) {
    fetch(`${backend}/array-salt/claims`)
        .then(r => r.json())
        .then(res => {
            console.log("Response", res);
            console.log("Building merkle tree from claims", res.claims);
            const proofTree = arraySaltMerkleAuth.getProofTree(res.claims, res.signingProperties);
            setAuthorization({...res, proofTree})
        })
        .catch(() => setAuthorization("fail"));
}

function requestArrSaltSingle({proofTree, signature}, setResponse) {
    const proof = proofTree.getProof("a");
    fetchWithProof("array-salt/resource/single", {proof, signature}, setResponse)
}

function requestArrSaltSingleOther({proofTree, signature}, setResponse) {
    const proof = proofTree.getProof("a");
    fetchWithProof("array-salt/resource/single2", {proof, signature}, setResponse)
}

function requestArrSaltMultiple({proofTree, signature}, setResponse) {
    const proof = proofTree.getProof("a", "g");
    fetchWithProof("array-salt/resource/multiple", {proof, signature}, setResponse)
}

function requestArrSaltMultipleOther({proofTree, signature}, setResponse) {
    const proof = proofTree.getProof("a", "g");
    fetchWithProof("array-salt/resource/multiple2", {proof, signature}, setResponse)
}

function requestArrSaltEmptyProof({proofTree, signature}, setResponse) {
    const proof = proofTree.getProof();
    fetchWithProof("array-salt/resource/multiple", {proof, signature}, setResponse)
}

function requestArrSaltNoClaims({proofTree, signature}, setResponse) {
    fetchApi('array-salt/resource/multiple', setResponse)
}

function getObjClaims(setAuthorization) {
    fetch(`${backend}/object/claims`)
        .then(r => r.json())
        .then(res => {
            console.log("Response", res);
            console.log("Building merkle tree from claims", objectMerkleAuth.claimsToLeaves(res.claims));
            const proofTree = objectMerkleAuth.getProofTree(res.claims);
            setAuthorization({...res, proofTree})
        })
        .catch(() => setAuthorization("fail"));
}

function requestObjSingle({proofTree, signature}, setResponse) {
    const proof = proofTree.getProof("$.user.id");
    fetchWithProof("object/resource/single", {proof, signature}, setResponse)
}

function requestObjSingleOther({proofTree, signature}, setResponse) {
    const proof = proofTree.getProof("$.user.id");
    fetchWithProof("object/resource/single2", {proof, signature}, setResponse)
}

function requestObjMultiple({proofTree, signature}, setResponse) {
    const proof = proofTree.getProof("$.user.id", "$.user.products[2]");
    fetchWithProof("object/resource/multiple", {proof, signature}, setResponse)
}

function requestObjMultipleOther({proofTree, signature}, setResponse) {
    const proof = proofTree.getProof("$.user.id", "$.user.products[2]");
    fetchWithProof("object/resource/multiple2", {proof, signature}, setResponse)
}

function requestObjEmptyProof({proofTree, signature}, setResponse) {
    const proof = proofTree.getProof();
    fetchWithProof("object/resource/multiple", {proof, signature}, setResponse)
}

function requestObjNoClaims({proofTree, signature}, setResponse) {
    fetchApi('object/resource/multiple', setResponse)
}

function fetchWithProof(path, {proof, signature}, setResponse) {
    const claimsHeader = JSON.stringify({proof, signature});
    console.log("Sending proof:", claimsHeader);
    return fetchApi(path, setResponse, {'Claims-User': btoa(claimsHeader)});
}

function fetchApi(path, setResponse, headers = {}) {
    fetch(`${backend}/${path}`, {headers})
        .then(r => r.json())
        .then(() => setResponse("success"))
        .catch(() => setResponse("fail"));
}

function App() {
    const [authorizationArr, setAuthorizationArr] = useState(undefined);
    const [responseArr, setResponseArr] = useState(undefined);
    const [responseArr2, setResponseArr2] = useState(undefined);
    const [responseArr3, setResponseArr3] = useState(undefined);
    const [responseArr4, setResponseArr4] = useState(undefined);
    const [responseArr5, setResponseArr5] = useState(undefined);
    const [responseArr6, setResponseArr6] = useState(undefined);
    const [responseArr7, setResponseArr7] = useState(undefined);
    const [authorizationArrSalt, setAuthorizationArrSalt] = useState(undefined);
    const [responseArrSalt, setResponseArrSalt] = useState(undefined);
    const [responseArrSalt2, setResponseArrSalt2] = useState(undefined);
    const [responseArrSalt3, setResponseArrSalt3] = useState(undefined);
    const [responseArrSalt4, setResponseArrSalt4] = useState(undefined);
    const [responseArrSalt5, setResponseArrSalt5] = useState(undefined);
    const [responseArrSalt6, setResponseArrSalt6] = useState(undefined);
    const [responseArrSalt7, setResponseArrSalt7] = useState(undefined);
    const [authorizationObj, setAuthorizationObj] = useState(undefined);
    const [responseObj, setResponseObj] = useState(undefined);
    const [responseObj2, setResponseObj2] = useState(undefined);
    const [responseObj3, setResponseObj3] = useState(undefined);
    const [responseObj4, setResponseObj4] = useState(undefined);
    const [responseObj5, setResponseObj5] = useState(undefined);
    const [responseObj6, setResponseObj6] = useState(undefined);
    const [responseObj7, setResponseObj7] = useState(undefined);

    return (
        <>
            <h2>Arrays:</h2>

            <div>
                <button onClick={() => getArrClaims(setAuthorizationArr)}>Fetch claims</button>
                {authorizationArr == null ? 'none' : 'ok'}
            </div>
            <div>
                <button onClick={() => requestArrSingle(authorizationArr, setResponseArr)}>Perform request</button>
                {responseArr}
            </div>
            <div>
                <button onClick={() => requestArrSingleOther(authorizationArr, setResponseArr2)}>
                    Perform request with wrong claims.
                </button>
                {responseArr2}
            </div>
            <div>
                <button onClick={() => requestArrMultiple(authorizationArr, setResponseArr3)}>
                    Perform request with multiple claims.
                </button>
                {responseArr3}
            </div>
            <div>
                <button onClick={() => requestArrMultipleOther(authorizationArr, setResponseArr4)}>
                    Perform request with multiple claims, one of which is wrong.
                </button>
                {responseArr4}
            </div>
            <div>
                <button
                    onClick={() => requestArrMultiple({...authorizationArr, signature: 'forgot.'}, setResponseArr5)}>
                    Perform request with multiple claims, but wrong signature
                </button>
                {responseArr5}
            </div>
            <div>
                <button onClick={() => requestArrEmptyProof(authorizationArr, setResponseArr6)}>
                    Perform request with empty proof.
                </button>
                {responseArr6}
            </div>
            <div>
                <button onClick={() => requestArrNoClaims(authorizationArr, setResponseArr7)}>
                    Perform request without claims.
                </button>
                {responseArr7}
            </div>
            <br/>
            <h2>Arrays (with salting):</h2>

            <div>
                <button onClick={() => getArrSaltClaims(setAuthorizationArrSalt)}>Fetch claims</button>
                {authorizationArrSalt == null ? 'none' : 'ok'}
            </div>
            <div>
                <button onClick={() => requestArrSaltSingle(authorizationArrSalt, setResponseArrSalt)}>Perform request
                </button>
                {responseArrSalt}
            </div>
            <div>
                <button onClick={() => requestArrSaltSingleOther(authorizationArrSalt, setResponseArrSalt2)}>
                    Perform request with wrong claims.
                </button>
                {responseArrSalt2}
            </div>
            <div>
                <button onClick={() => requestArrSaltMultiple(authorizationArrSalt, setResponseArrSalt3)}>
                    Perform request with multiple claims.
                </button>
                {responseArrSalt3}
            </div>
            <div>
                <button onClick={() => requestArrSaltMultipleOther(authorizationArrSalt, setResponseArrSalt4)}>
                    Perform request with multiple claims, one of which is wrong.
                </button>
                {responseArrSalt4}
            </div>
            <div>
                <button
                    onClick={() => requestArrSaltMultiple({...authorizationArrSalt, signature: 'forgot.'},
                        setResponseArrSalt5)}>
                    Perform request with multiple claims, but wrong signature
                </button>
                {responseArrSalt5}
            </div>
            <div>
                <button onClick={() => requestArrSaltEmptyProof(authorizationArrSalt, setResponseArrSalt6)}>
                    Perform request with empty proof.
                </button>
                {responseArrSalt6}
            </div>
            <div>
                <button onClick={() => requestArrSaltNoClaims(authorizationArrSalt, setResponseArrSalt7)}>
                    Perform request without claims.
                </button>
                {responseArrSalt7}
            </div>
            <br/>

            <h2>Object:</h2>
            <div>
                <button onClick={() => getObjClaims(setAuthorizationObj)}>Fetch claims</button>
                {authorizationObj == null ? 'none' : 'ok'}
            </div>
            <div>
                <button onClick={() => requestObjSingle(authorizationObj, setResponseObj)}>Perform request</button>
                {responseObj}
            </div>
            <div>
                <button onClick={() => requestObjSingleOther(authorizationObj, setResponseObj2)}>
                    Perform request with wrong claims.
                </button>
                {responseObj2}
            </div>
            <div>
                <button onClick={() => requestObjMultiple(authorizationObj, setResponseObj3)}>
                    Perform request with multiple claims.
                </button>
                {responseObj3}
            </div>
            <div>
                <button onClick={() => requestObjMultipleOther(authorizationObj, setResponseObj4)}>
                    Perform request with multiple claims, one of which is wrong.
                </button>
                {responseObj4}
            </div>
            <div>
                <button
                    onClick={() => requestObjMultiple({...authorizationObj, signature: 'forgot.'}, setResponseObj5)}>
                    Perform request with multiple claims, but wrong signature
                </button>
                {responseObj5}
            </div>
            <div>
                <button onClick={() => requestObjEmptyProof(authorizationObj, setResponseObj6)}>
                    Perform request with empty proof.
                </button>
                {responseObj6}
            </div>
            <div>
                <button onClick={() => requestObjNoClaims(authorizationObj, setResponseObj7)}>
                    Perform request without claims.
                </button>
                {responseObj7}
            </div>
        </>
    );
}

export default App;

import React, {useState} from 'react';
import fetch from 'isomorphic-unfetch';
import {fromClaimsObj, objectToClaims} from "merkle-auth-jsonpath";
import {fromClaimsArray} from "merkle-auth-array";

function getJpClaims(setAuthorization) {
    fetch("http://localhost:3001/jsonpath/claims") // TODO proper REST HTTP methods
        .then(r => r.json())
        .then(res => {
            console.log("Response", res);
            console.log("Building merkle tree from claims", objectToClaims(res.claims));
            const merkleTree = fromClaimsObj(res.claims);
            setAuthorization({...res, merkleTree})
        })
        .catch(() => setAuthorization("fail"));
}

function requestJpSingle({merkleTree, signature}, setResponse) {
    const proof = merkleTree.getProof("$.user.id");
    fetchWithProof("jsonpath/resource/single", {proof, signature}, setResponse)
}

function requestJpSingleOther({merkleTree, signature}, setResponse) {
    const proof = merkleTree.getProof("$.user.id");
    fetchWithProof("jsonpath/resource/single2", {proof, signature}, setResponse)
}

function requestJpMultiple({merkleTree, signature}, setResponse) {
    const proof = merkleTree.getProof("$.user.id", "$.user.products[2]");
    fetchWithProof("jsonpath/resource/multiple", {proof, signature}, setResponse)
}

function requestJpMultipleOther({merkleTree, signature}, setResponse) {
    const proof = merkleTree.getProof("$.user.id", "$.user.products[2]");
    fetchWithProof("jsonpath/resource/multiple2", {proof, signature}, setResponse)
}

function requestJpEmptyProof({merkleTree, signature}, setResponse) {
    const proof = merkleTree.getProof();
    fetchWithProof("jsonpath/resource/multiple", {proof, signature}, setResponse)
}

function requestJpNoClaims({merkleTree, signature}, setResponse) {
    fetchApi('jsonpath/resource/multiple', setResponse)
}

function getArrClaims(setAuthorization) {
    fetch("http://localhost:3001/array/claims") // TODO proper REST HTTP methods
        .then(r => r.json())
        .then(res => {
            console.log("Response", res);
            console.log("Building merkle tree from claims", res.claims);
            const merkleTree = fromClaimsArray(res.claims);
            setAuthorization({...res, merkleTree})
        })
        .catch(() => setAuthorization("fail"));
}

function requestArrSingle({merkleTree, signature}, setResponse) {
    const proof = merkleTree.getProof("a");
    fetchWithProof("array/resource/single", {proof, signature}, setResponse)
}

function requestArrSingleOther({merkleTree, signature}, setResponse) {
    const proof = merkleTree.getProof("a");
    fetchWithProof("array/resource/single2", {proof, signature}, setResponse)
}

function requestArrMultiple({merkleTree, signature}, setResponse) {
    const proof = merkleTree.getProof("a", "g");
    fetchWithProof("array/resource/multiple", {proof, signature}, setResponse)
}

function requestArrMultipleOther({merkleTree, signature}, setResponse) {
    const proof = merkleTree.getProof("a", "g");
    fetchWithProof("array/resource/multiple2", {proof, signature}, setResponse)
}

function requestArrEmptyProof({merkleTree, signature}, setResponse) {
    const proof = merkleTree.getProof();
    fetchWithProof("array/resource/multiple", {proof, signature}, setResponse)
}

function requestArrNoClaims({merkleTree, signature}, setResponse) {
    fetchApi('array/resource/multiple', setResponse)
}

function fetchWithProof(path, {proof, signature}, setResponse) {
    const claimsHeader = JSON.stringify({proof, signature});
    console.log("Sending proof:", claimsHeader);
    return fetchApi(path, setResponse, {'Claims-User': btoa(claimsHeader)});
}

function fetchApi(path, setResponse, headers = {}) {
    fetch(`http://localhost:3001/${path}`, {headers}) // TODO proper REST HTTP methods
        .then(r => r.json())
        .then(() => setResponse("success"))
        .catch(() => setResponse("fail"));
}

function App() {
    const [authorizationJp, setAuthorizationJp] = useState(undefined);
    const [responseJp, setResponseJp] = useState(undefined);
    const [responseJp2, setResponseJp2] = useState(undefined);
    const [responseJp3, setResponseJp3] = useState(undefined);
    const [responseJp4, setResponseJp4] = useState(undefined);
    const [responseJp5, setResponseJp5] = useState(undefined);
    const [responseJp6, setResponseJp6] = useState(undefined);
    const [responseJp7, setResponseJp7] = useState(undefined);
    const [authorizationArr, setAuthorizationArr] = useState(undefined);
    const [responseArr, setResponseArr] = useState(undefined);
    const [responseArr2, setResponseArr2] = useState(undefined);
    const [responseArr3, setResponseArr3] = useState(undefined);
    const [responseArr4, setResponseArr4] = useState(undefined);
    const [responseArr5, setResponseArr5] = useState(undefined);
    const [responseArr6, setResponseArr6] = useState(undefined);
    const [responseArr7, setResponseArr7] = useState(undefined);

    return (
        <>
            <h2>JSONPath:</h2>
            <div>
                <button onClick={() => getJpClaims(setAuthorizationJp)}>Fetch claims</button>
                {authorizationJp == null ? 'none' : 'ok'}
            </div>
            <div>
                <button onClick={() => requestJpSingle(authorizationJp, setResponseJp)}>Perform request</button>
                {responseJp}
            </div>
            <div>
                <button onClick={() => requestJpSingleOther(authorizationJp, setResponseJp2)}>
                    Perform request with wrong claims.
                </button>
                {responseJp2}
            </div>
            <div>
                <button onClick={() => requestJpMultiple(authorizationJp, setResponseJp3)}>
                    Perform request with multiple claims.
                </button>
                {responseJp3}
            </div>
            <div>
                <button onClick={() => requestJpMultipleOther(authorizationJp, setResponseJp4)}>
                    Perform request with multiple claims, one of which is wrong.
                </button>
                {responseJp4}
            </div>
            <div>
                <button onClick={() => requestJpMultiple({...authorizationJp, signature: 'forgot.'}, setResponseJp5)}>
                    Perform request with multiple claims, but wrong signature
                </button>
                {responseJp5}
            </div>
            <div>
                <button onClick={() => requestJpEmptyProof(authorizationJp, setResponseJp6)}>
                    Perform request with empty proof.
                </button>
                {responseJp6}
            </div>
            <div>
                <button onClick={() => requestJpNoClaims(authorizationJp, setResponseJp7)}>
                    Perform request without claims.
                </button>
                {responseJp7}
            </div>
            <br/>
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
        </>
    );
}

export default App;

# Merkle auth
Library for Merkle tree based authorization on the web.

## Usage

### Set-up
```
import {MerkleAuth} from "merkle-auth";
const merkleAuth = new MerkleAuth(options);
```

### Building a Merkle tree
```
const {rootHash, signingProperties} = merkleAuth.build(claims);
const JWT = jwt.sign({rootHash}, ...) // Sign the root hash
```

### Building a proof tree
```
const proofTree = arrayMerkleAuth.getProofTree(claims);
const proof = proofTree.getProof(...); // Specify values to be proven.
```

###  Verifying the proof
```
const {rootHash} = jwt.verify(JWT, ...) // Receive signed root hash from the JWT.
const claims = merkleAuth.verify(proof, actualRootHash => actualRootHash === rootHash);
```

## Options
### Array of values as claims
```
const options = {};
```

### Object of values as claims
```
import {withObjectClaims} from "merkle-auth-object";
const options = withObjectClaims({});
```

### Enable salting
```
import {withSalt} from "merkle-auth-salt";
const options = withSalt({});
```

### Combined options

```
import {withObjectClaims} from "merkle-auth-object";
import {withSalt} from "merkle-auth-salt";
const options = withSalt(withObjectClaims({}));
```

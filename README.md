## YAIR Token Development

[![CircleCI](https://circleci.com/gh/yairtoken/yair-token.svg?style=svg&circle-token=f533de9156b9356ab04069cb5daf27fb5f8db2d3)](https://circleci.com/gh/yairtoken/yair-token)

### This project uses:
- [Truffle v5](https://truffleframework.com/)
- [Ganache](https://truffleframework.com/ganache)
- [Solium](https://github.com/duaraghav8/Solium)
- [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-solidity)
- [Circle CI](https://circleci.com/gh/yairtoken)

### Installation of tools;

1. Install Truffle and Ganache CLI globally.

```
npm install -g truffle
npm install -g ganache-cli
```

### Setup for development

How to set it up for development:

```
git clone git@github.com:yairtoken/yair-token.git
cd yair-token
npm install
truffle compile
```

Open in another terminal `ganache-cli`.

Switch back to your main terminal and start migration and run the tests:

```
truffle migrate && truffle test
```



**Token Standard for Co-Owned Assets (C.O.A. standard).**



The C.O.A. Standard is designed to have a contained economy, where there is a parent token, that can be used to embody multiple assets. These are represented by an I.D. called AssetID (asset identification number).



The C.O.A. standard is a variation of the ERC20 standard, with 3 additional mappings.

### 1st mapping



**address** (Owner)

**assetID** (Asset identification string, eg. “artwork name”)

**ownedAssetTokenCount** (the number of tokens of a particular asset held by the owner wallet)



    mapping (address => mapping (string => uint256)) private _ownedAssetTokenCount;



So each wallet (**address**) contains an array of **assetID** referencing the **ownedAssetTokenCount**



Giving us the total number of tokens each wallet holds for each asset.

### 2nd Mapping

Must always be in lockstep with 1st mapping

The total number of tokens expressing a particular asset: **assetTokenCount**



must be mapped against the **assetID**.



Whenever tokens for an assetID are minted or burned, both mappings described above must be changed in sync or the transactions will be invalid.



When tokens for an assetID are simply transferred from one address to another there must be no change in the assetTokenCount:



    mapping (string => uint256) private _assetTokenCount;



Hence we provide external functions to perform token transfers, which have no direct access to these mappings.

### 3rd Mapping



This mapping maps **assetID** to **assetMetaData**



**assetMetaData** is a data structure that is multi purpose. It could be used to link a IPFS file hash of a digital asset or urls to artist website, thumbnails or descriptions etc.



    struct _assetMetaData {

    string uri;

    string name;

    // and so on

    }

    mapping (string => uint256) private _assetMetaData;



(NOtes for development)


ERC20 Methods

- list all open IAOs
- brand token fro specific artwork
- list my branded token
- unbrand a token
- brandToken nur bei aktuellen IAOs
- lock token in precommit phase
- unbrand token kostet penalty fee

- M;ultiplier on per IAO phses
>  recipient address for burned tokens
>  getRate()


----

Phase -> IAO Contract
Refunding/Cancellation
No unbrand during Precommit phase or cancellation (state)
Cancel State
Artwork-reserve (no access ferom outside)
Difference of multiplier goes to special wallet (defaiults to artwork reserve)

Wenn die base valuation erreicht wurde, landet a


Input für IAO:
- base valuation (YAIR)
- precommit phase bis das voll ist
- Verteilungsschlüssel
    + mapping(address => percentage)
- method payOutShareholders()
- refund()


Extra token/wallet for IR



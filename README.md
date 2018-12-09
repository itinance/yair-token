
## YAIR Token Development

[![CircleCI](https://circleci.com/gh/yairtoken/yair-token.svg?style=svg&circle-token=f533de9156b9356ab04069cb5daf27fb5f8db2d3)](https://circleci.com/gh/yairtoken/yair-token)



## YAIR Token Specs




**Token Supply:** 1 billion tokens, fixed



**Token States:** “unbranded”, “branded”



**Token Format:**



For the “unbranded” YAIR base token we shall use an ERC20 token standard. This will provide the following advantages:

-   fast track and cheap auditing

-   easy integration into existing wallets

-   possible adoption by existing exchanges.




When “unbranded” tokens are committed to I.A.O. (Initial Artwork Offering) they change state from “unbranded” to “branded” tokens. This process puts the “unbranded” YAIRS (ERC20) into a “paused” state they are frozen, and mints “branded tokens”. The logic is that the tokens exist can move from a branded to an unbranded state and back again but the total supply of YAIRS stays fixed.

For the “branded” YAIR token more complexity is unavoidable.

After reviewing ERC20 and ERC721, (and other more experimental token standards like ERC1155) we realised that we must create a new token standard with some functionality from both ERC20 and ERC721. Our token standard is essentially an extension of the ERC20 token standard that allows it to have subdivisions that can be used to express equity in an asset… So if the ownership is expressed 100% by the total supply of the asset token, then each token from the subdivision that represents an asset is an equity portion = 1/(total supply of asset).



The reason ERC721 was not suitable is that it exists as an individually numbered supply. Each token has an ID. Each transfer, branding or rebranding must be separate “on chain” operation for each individual token, making it expensive and slow. Some fungibility makes it more efficient.



We have begun to develop a new general token standard that we will use for our “branded” tokens. We aim to submit our new token standard as an EIP and also an Aeternity token standard. We will provide base classes to the OpenZeppelin framework (and any Aeternity equivalent framework) with a pull request to their github repository and we will seek community sourced improvements.



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

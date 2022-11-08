# Multi-standard Token contract for marketplace

## The repo contains 2 contracts
1. The contract uses a ERC1155 contract where in we use particular token ID  to represent fungible tokens, with properties just as standard ERC20.
But this fungible token can later be used to mint NFT's by paying in exchange of the minted NFT.

2. A NFT marketplace contract to facilitate trade of any NFT of ERC1155 standard using the Fungible Token from the previous contract for exchange of value.

 => The MarketPlace Contract has two versions: 

 1. v1 has a unique marketplace Id which gets generated when the user lists new NFT's which can be useful while handeling NFT's on backend .
 2. v2 identifies the listed contract using contract address and tokenID. 

Try running some of the following tasks:

```shell
npx hardhat compile
npx hardhat help
npx hardhat test
```

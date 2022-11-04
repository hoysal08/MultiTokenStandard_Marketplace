// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import  "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract NFTContract is Ownable,ERC1155{

    uint256 public constant FT=1;
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // uint256 public constant PRICE_PER_NFT= 0.001 ether;
    
    constructor(string memory baseURI)ERC1155(baseURI)Ownable() {
      _tokenIds.increment();
      _mint(msg.sender,FT,10**18,"");
    }
    function getTokenID() public view returns(uint256){
      return _tokenIds.current();
    }

    function mint(address to,uint256 amount,bytes memory data) public {
      _tokenIds.increment();
      uint256 tokenid = _tokenIds.current();
      _mint(to,tokenid,amount,data);
    }

    function mintBatch(address to,uint256[] memory amounts,bytes memory data) public{
     
      for(uint i = 0;i<amounts.length;i++)
      {
       _tokenIds.increment();
       uint256 tokenid = _tokenIds.current();
       _mint(to,tokenid,amounts[i],data);
      }
    }

}
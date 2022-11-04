// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is ERC1155Holder,Ownable {

    uint256 public immutable FT_Token_ID;
    address public immutable FT_Token_Contract;

     struct NFTMarketItem{
        uint256 MpId;
        uint256 tokenId;
        address contract_address;
        uint256 amount;
        uint256 price;
        address payable owner;
    }

    uint256 public MarketplaceId=1;

    mapping (uint256=>NFTMarketItem) public mpidtoitem;
    mapping (address=>mapping(uint256=>uint256)) public tokentompid;

    constructor(uint256 _ft_token_id,address _ft_token_contract) Ownable() {
        FT_Token_ID=_ft_token_id;
        FT_Token_Contract=_ft_token_contract;
    }
    
    function listNFT(address _nftcontract,uint256 _tokenId,uint256 _amount,uint256 _price) external{

       require(_nftcontract!=address(0),"Invalid address");
       require(_amount>0,"minimum of 1 Token has to be listed");
       require(_price>0,"price per NFT should be greater than 0");
      
       IERC1155(_nftcontract).safeTransferFrom(msg.sender, address(this), _tokenId, _amount, "");

       mpidtoitem[MarketplaceId] = NFTMarketItem(
            MarketplaceId,
            _tokenId,
            _nftcontract,
            _amount,
            _price,
            payable(msg.sender)
        );
        tokentompid[_nftcontract][_tokenId] = MarketplaceId;
        MarketplaceId++;
    }

    function BuyNft(uint256 mpid,uint256 _amount) external {

        require(_amount>0,"minimum of 1 Token has to be listed");
        require(mpid>0,"Invalid MarketplaceId");

       NFTMarketItem memory itemtobesold = mpidtoitem[mpid];
       uint256 costofNFT=itemtobesold.price*_amount;


       require(itemtobesold.contract_address!=address(0),"Token not for sale");
       require(itemtobesold.amount<=_amount,"The requested amount of tokens are more than available tokens");
       require(costofNFT<=IERC1155(FT_Token_Contract).balanceOf(msg.sender,FT_Token_ID),"Low balance to buy the requested tokens");

      IERC1155(FT_Token_Contract).safeTransferFrom(msg.sender, owner(), FT_Token_ID, costofNFT, "");
      IERC1155(FT_Token_Contract).safeTransferFrom(address(this),msg.sender,itemtobesold.tokenId,_amount,"");
      
      if(itemtobesold.amount==_amount)
      {
         delete mpidtoitem[mpid];
      }
      else
      {
        mpidtoitem[mpid].amount-=_amount;
      }

    }
}
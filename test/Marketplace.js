const {loadFixture}=require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const FT_Token_Id=1;
const baseuri="www.test.com";

describe("MarketPlace",async()=>{

    async function deployFixture(){
        const [owner,account1,account2]=await ethers.getSigners();

        const NFTContract=await ethers.getContractFactory("NFTContract",owner);
        const nftcontract=await NFTContract.deploy(baseuri);
        await nftcontract.deployed();
        
        const MarketPlace=await  ethers.getContractFactory("Marketplacev2",owner);
        const marketplace=await MarketPlace.deploy(FT_Token_Id,nftcontract.address);
        await marketplace.deployed();

        const Transfer_Amount=ethers.utils.parseUnits("0.15", "ether");


        await nftcontract.connect(owner).safeTransferFrom(owner.address,account1.address,FT_Token_Id,Transfer_Amount,"0x");
        await nftcontract.connect(owner).safeTransferFrom(owner.address,account2.address,FT_Token_Id,Transfer_Amount,"0x");


        return {owner,nftcontract,marketplace,account1,account2};
        }

        describe("Constructor",async()=>{
            it("should assign correct contract address and token ID",async()=>{
                const {owner,nftcontract,marketplace,account1,account2}=await loadFixture(deployFixture);
                expect( await marketplace.FT_Token_ID()).to.be.equal(FT_Token_Id);
                expect(await marketplace.FT_Token_Contract()).to.be.equal(nftcontract.address);
            })
        })

        describe("ListNFT",async()=>{
            it("should be able to list nft ",async()=>{
            
                const {owner,nftcontract,marketplace,account1,account2}=await loadFixture(deployFixture);
                let amount=4 

                await nftcontract.connect(account1).mint(account1.address,amount,"0x");
                let mintedNFTid=await nftcontract.getTokenID();
                let amountforsale=2
                const nftprice=ethers.utils.parseUnits("0.005", "ether");


                expect(await nftcontract.balanceOf(account1.address,mintedNFTid)).to.be.equal(amount);
               
                await nftcontract.connect(account1).safeTransferFrom(account1.address,account2.address,mintedNFTid,amountforsale,"0x");

                expect(await nftcontract.balanceOf(account2.address,mintedNFTid)).to.be.equal(amountforsale);

                await nftcontract.connect(account1).setApprovalForAll(marketplace.address,true)
                await marketplace.connect(account1).listNFT(nftcontract.address,mintedNFTid,amountforsale,nftprice);

                expect(await nftcontract.balanceOf(marketplace.address,mintedNFTid)).to.be.equal(amountforsale);
            })
        })

        describe("BuyNft",async()=>{
            it("nft should be able to bought", async()=>{

                const {owner,nftcontract,marketplace,account1,account2}=await loadFixture(deployFixture);
    
                let amount=4; 
                await nftcontract.connect(account1).mint(account1.address,amount,"0x");
                let mintedNFTid=await nftcontract.getTokenID();
                let amountforsale=3;
                const nftprice=ethers.utils.parseUnits("0.005", "ether");
    
                expect(await nftcontract.balanceOf(account1.address,mintedNFTid)).to.be.equal(amount);
               
    
    
                await nftcontract.connect(account1).setApprovalForAll(marketplace.address,true);
                await marketplace.connect(account1).listNFT(nftcontract.address,mintedNFTid,amountforsale,nftprice);
    
                let amounttobebought=2;
                await nftcontract.connect(account2).setApprovalForAll(marketplace.address,true);

    
                await marketplace.connect(account2).BuyNft(nftcontract.address,mintedNFTid,amounttobebought);

                expect(await nftcontract.balanceOf(account2.address,mintedNFTid)).to.be.equal(amounttobebought);
            })


        })
    })
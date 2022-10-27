const {loadFixture}=require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
// const { ethers } = require("hardhat");

const baseuri="www.test.com";
const FT_Token_Id=1;

describe("MarketPlace",async()=>{

    async function deployFixture(){
        const [owner,account1,account2]=await ethers.getSigners();
        const Contract=await ethers.getContractFactory("MarketPlace",owner);
        const contract=await Contract.deploy(baseuri);
        await contract.deployed();
        return {owner,contract,account1,account2};
        }

   describe("Constructor",async()=>{
    it("Should be assign to the right owner",async()=>{
     const {owner,contract,account1,account2}=await loadFixture(deployFixture);
     expect(await contract.owner()).to.be.equal(owner.address)
    })
    it("Should set the right base uri",async()=>{
        const {owner,contract,account1,account2}=await loadFixture(deployFixture);
        expect(await contract.uri(1)).to.be.equal(baseuri)
    })
    it("Should mint 10**18 to the owner",async()=>{
        const {owner,contract,account1,account2}=await loadFixture(deployFixture);
        const val=ethers.utils.parseUnits('1', 18)
        const mintedval=await contract.balanceOf(owner.address,FT_Token_Id);
        expect(mintedval).to.be.equal(val);
    })
    it("Token Id must be 1 after the deployment",async()=>{
        const {owner,contract,account1,account2}=await loadFixture(deployFixture);
        expect(await contract.getTokenID()).to.be.equal(1);
    })
   })
   describe("Mint",async()=>{
    it("should mint a NFT's to accounts",async()=>{
        const {owner,contract,account1,account2}=await loadFixture(deployFixture);
        const Transfer_Amount=ethers.utils.parseUnits("0.2", "ether");
        const amount=1;
        await contract.connect(owner).safeTransferFrom(owner.address,account1.address,FT_Token_Id,Transfer_Amount,"0x");
        await contract.connect(account1).mint(account1.address,amount,"0x");
        let TokenId=await contract.getTokenID();
        expect(await contract.balanceOf(account1.address,TokenId)).to.be.equal(amount)
    })

    it("should mint multiple NFT's to  a account with same TokenId ",async ()=>{
        const {owner,contract,account1,account2}=await loadFixture(deployFixture);
        const Transfer_Amount=ethers.utils.parseUnits("0.6", "ether");
        const amount=5;
        await contract.connect(owner).safeTransferFrom(owner.address,account2.address,FT_Token_Id,Transfer_Amount,"0x");
        await contract.connect(account2).mint(account2.address,amount,"0x");
        let TokenId=await contract.getTokenID();
        expect(await contract.balanceOf(account2.address,TokenId)).to.be.equal(amount)
    })
   })
   
})
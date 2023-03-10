import React, { useEffect, useState } from 'react'
import Escrow from './artifacts/contracts/Escrow.sol/Escrow';
import server from './server';
import {Contract,ethers} from 'ethers';
import { approve } from './App';
import PushNotify from './PushNotify';
import {Utils} from 'alchemy-sdk'
import Loader from './Loader';
import CcButton from './CcButton';
import { extendTheme, ChakraProvider,Box, Input, Button } from '@chakra-ui/react'
export default function Archive({jwt,user}) {
const provider = new ethers.providers.Web3Provider(window.ethereum);
const[archive,setArchive]=useState([])


/*
  localStorage.setItem('escrowContractAddress', escrowContract.address);

// Later, when you need to retrieve the contract object:
const escrowContractAddress = localStorage.getItem('escrowContractAddress');
const escrowContract = new web3.eth.Contract(ABI, escrowContractAddress);
*/

useEffect(()=>{async function fetch(){
  const config={
    headers:{
      Authorization:`Bearer ${jwt}`
    }
  }
  const{data:Archive}=await server.get("getarchive",config)
  console.log("Archive:",Archive)
  setArchive(Archive)
}
fetch();
},[jwt])
//console.log("Archive",archive)
const handleAllContracts=()=>{
  async function fetch(){
    const config={
      headers:{
        Authorization:`Bearer ${jwt}`
      }
    }
    const{data:Archive}=await server.get("getarchive",config)
    console.log("Archive:",Archive)
    setArchive(Archive)
  }
  fetch();
  
}
const handleAppContracts=()=>{
let appContracts=[]
const config={
  headers:{
    Authorization:`Bearer ${jwt}`
  }
}
async function fetch(){
  const{data:Archive}=await server.get("getarchive",config)
  console.log("Archive:",Archive)
  Archive.map((arch)=>{
    if(arch.isapproved){
      appContracts.push(arch)
    }
  })
  console.log(appContracts)
  setArchive(appContracts)
}
fetch();

}
const handleunappContracts=()=>{
  let unappContracts=[]
  const config={
    headers:{
      Authorization:`Bearer ${jwt}`
    }
  }
  async function fetch(){
    const{data:Archive}=await server.get("getarchive",config)
    console.log("Archive:",Archive)
    Archive.map((arch)=>{
      if(!arch.isapproved){
        unappContracts.push(arch)
      }
    })
    console.log(unappContracts)
    setArchive(unappContracts)
  }
  fetch();
 
}
const handleApproveArchive= async (contract_address,isapproved) => {
  const contract=new Contract(contract_address, Escrow.abi, provider);
  contract.on('Approved', () => {
    document.getElementById(contract.address).className =
      'complete';
    document.getElementById(contract.address).innerText =
      "??? It's been approved!";
  });
  const signer=provider.getSigner();
  await approve(contract, signer);
}

const handleCheckApprove=async(contract_address)=>{
  try {
    const contract=new Contract(contract_address, Escrow.abi, provider);
    const signer=provider.getSigner();
    const approvd=await contract.connect(signer).getInfo()
    console.log(approvd)
    if(approvd){
      document.getElementById(contract.address).className =
      'complete';
      document.getElementById(contract.address).innerText =
      "??? It's been approved!";
      PushNotify('success','EVM Report',`Contract is already been approved!!`,3000)
    }else{
      
      PushNotify('warning','EVM Report',`Contract is not approved yet!!`,3000)
      
    }
  } catch (revertReason) {
    console.log(revertReason)
    PushNotify('error','EVM Error',(`${revertReason.code}, Method:${revertReason.method} Contract Not deployed`),5000)
  }
 
}
return(
  <div className="existing-contract">
    <Box display="flex" justifyContent="space-between">
  <Button colorScheme={'red'} mx={2}
          
          onClick={(e) => {
            e.preventDefault();

            handleAllContracts();
          }}
        >
        Refresh Contracts by Database
        </Button>
        <Button colorScheme={'green'} mx={2}
          
          onClick={(e) => {
            e.preventDefault();

            handleAppContracts();
          }}
        >
         Query Approved Contracts By Database
        </Button>
        <Button colorScheme={'blue'} mx={2}
          
          onClick={(e) => {
            e.preventDefault();

            handleunappContracts();
          }}
        >
         Query Unappproved Contracts By Database
        </Button >
        </Box>
  {archive.length >= 1 ?<>{archive.reverse().map((arch)=>
    
    <div className='container'key={arch.contract_address}>
      
      <ul className='fields'>
      <li>
          <div>Contract Owner</div>
          <div>{arch.username}</div>
        </li>
        <li>
          <div>Chain</div>
          <div>{arch.chain}</div>
        </li>
        <li>
        <div>Contract Address</div>
        <div>{arch.contract_address} <CcButton text={arch.contract_address}/></div>
        </li>
        <li>
        <div>Arbiter</div>
        <div>{arch.arbiter} <CcButton text={arch.arbiter}/></div>
        </li>
        <li>
        <div>Beneficiary</div>
        <div>{arch.beneficiary} <CcButton text={arch.beneficiary}/></div>
        </li>
        <li>
        <div>Value</div>
        <div>{Utils.formatEther(arch.amount)} <strong>ETH</strong></div>
        </li>
        <li>
    {arch.withinterest&&<div><strong>Eth Staked with %30 interest</strong></div>}
        </li>
         <li>
    {arch.isapproved&&<div><strong>Contract Approved</strong></div>}
        </li>
        <li>
    {!arch.isapproved&&<div
          className="button"
          id={arch.contract_address+1}
          onClick={(e) => {
            e.preventDefault();
            handleApproveArchive(arch.contract_address,arch.isapproved);
          }}
        >
          Approve
        </div>}
        </li>
        <li>
        <button
          className="button"
          id={arch.contract_address}
          onClick={(e) => {
            e.preventDefault();
            handleCheckApprove(arch.contract_address);
          }}
        >
         Check Approval By Contract
        </button>
        </li>
        </ul>
        
    </div>
    
  )}
  
  </> 
  :<Box display="flex" justifyContent="center"><div className='existing-contract'><Loader/></div></Box>}
  </div>
 
)}
import { ethers } from 'ethers';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow';

export default async function deploy(signer, arbiter, beneficiary,withInterest, value) {
  const stakerAddress="0x048Bd6BF26C3305c354aEFab0cb5D7D12D290688"
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );
    
    return factory.deploy(arbiter, beneficiary,withInterest,stakerAddress,{ value });
  
  
}

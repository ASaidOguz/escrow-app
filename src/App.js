import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Archive from './Archive';
import deploy from './deploy';
import Escrow from './Escrow';
import Login from './login/Login';
import PushNotify from './PushNotify';
import server from './server';
import InforCard from './card/InforCard';
import { extendTheme, ChakraProvider,Box, Input, Button,Text } from '@chakra-ui/react'
import {  EditIcon } from '@chakra-ui/icons'
import Loader from './Loader';
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })

if(!window.ethereum){PushNotify("error","Wallet","You need to install wallet to use The Dapp",10000)}
const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  try {
    const approveTxn = await escrowContract.connect(signer).approve();
    console.log("approveTXn:",approveTxn)
    await approveTxn.wait();
    sendApprove(escrowContract.address);
    
  } catch (revertReason) {
    console.log(revertReason.reason)
    PushNotify('error','EVM REVERT',revertReason.reason,5000)
    //alert(revertReason.reason)
  }
}

async function sendApprove(contract_address){
  const config={
    headers:{
      Authorization:`Bearer ${window.localStorage.getItem('jwt')}`
    }}
  const {
    data
  } = await server.post(`updateapprove`, {
    address: contract_address
    
  },config);
  console.log("Message:",data)
}


function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const[withInterest,setWithinterest]=useState(false);
  const[jwt,setJwt]=useState("")
  const[user,setUser]=useState("")
  //If jwt is null pls get the jwt from local storage if it exist! 
  if(jwt===""){
   setJwt(window.localStorage.getItem("jwt"))
   setUser((window.localStorage.getItem("user")))
  }

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
    console.log("Interest:",withInterest);
  }, [account,withInterest]);
 
  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.BigNumber.from((document.getElementById('wei').value* 10 ** 18).toString());
    
    try {
      console.log("Interest:",withInterest);
      const escrowContract = await deploy(signer, arbiter, beneficiary,withInterest, value);
      console.log("Contract chain name:",escrowContract.provider._network.name)
      console.log("Contract obj:",escrowContract)
      const escrow = {
        address: escrowContract.address,
        arbiter,
        beneficiary,
        value: value.toString(),
        escrowContract,
        withInterest:withInterest,
        signer
      };
      
      setEscrows([...escrows, escrow]);
      const config={
        headers:{
          Authorization:`Bearer ${jwt}`
        }}
      const {
        data
      } = await server.post(`send`, {
        user:user,
        chain:escrowContract.provider._network.name,
        address: escrowContract.address,
        arbiter:arbiter,
        beneficiary:beneficiary,
        value: value.toString(),
        withInterest,
        isApproved:false
      },config);
      console.log("Message:",data)
      PushNotify("success","Contract Deployment","Contract deployment initiated!")
    } catch (revertReason) {
      console.log(revertReason.reason)
      PushNotify("error",'EVM EXCEPTION',revertReason.reason)
    }
     
  }
  return (
    <ChakraProvider resetCSS={false}
                    >
   <Box bg='purple' w='98%' p={4} borderWidth='1px' borderRadius='lg' overflow='hidden'>
    <div className='float-container'>
      <Login jwt={jwt}
            setJwt={setJwt}
            user={user}
            setUser={setUser}/>
      </div>

        {jwt&&<div className='float-container'>
        <Box display="flex" justifyContent="space-between">
      <Box width={500}>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <Input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <Input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Ether)
          <Input type="text" id="wei" />
        </label>
    
        <div>
          <input onChange={(e)=>{setWithinterest(e.target.checked) 
                                      }}
        type={"checkbox"}></input>with Interest (Currently we have yearly %30 interest)
        </div>
        <Box display="flex" justifyContent="center">
        <Button 
        colorScheme='linkedin'  
        leftIcon={<EditIcon />}  
        variant='solid'
        className="button"
        
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </Button>
        
        </Box>
        <Box>
        <Text><strong>Just Fill the input sections</strong></Text>
        <Text><strong> Arbiter:</strong> The address as arbiter(The approver)</Text>
        <Text><strong>Beneficiary:</strong> The address as beneficiary(After the compilation of the work Arbiter will approve the transaction to beneficiary)</Text>
        <Text><strong>The amount you desire to stake or escrow value</strong></Text>
        <Text>- If you desire to apply %30 interest for your escrow contract please tick the Box</Text>
        </Box>
      </div>
      </Box>
      <Box >
      <div className="existing-contracts">
        <h1> Cached Contracts </h1>
        
        {escrows.length>0?<div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} user={user} />;
          })}
        </div>:<Loader/>}
      
       
      </div>
      </Box>
      <InforCard/>
      </Box>
      <Box display="flex" justifyContent="center">
      <div className='archived-contracts'>
      <Box display="flex" justifyContent="center">
      <h1> Archived Contracts </h1>
      </Box>
      <div id='container'>
        <Archive jwt={jwt}
        user={user}/>
        </div>
        </div>
      </Box>
      </div>
      }
      <footer>Made with ❤ by ASaidOguz</footer>
      </Box>
      </ChakraProvider>
    
  );
}

export default App;

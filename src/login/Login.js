import React, { useEffect, useState } from 'react'
import PushNotify from '../PushNotify'
import server from '../server'
import  stake from "../assets/stake1.jpg"
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Input,
  InputRightElement,
  Button,
  InputGroup,
  Stack,
  Image,
  Text,
  Textarea,


} from '@chakra-ui/react'
import { CheckCircleIcon, EditIcon, EmailIcon } from '@chakra-ui/icons'

export default function Login({jwt,setJwt,user,setUser}) {
    const[registerusername,setRegisterusername]=useState("")
    const[registeruserpass,setRegisteruserpass]=useState("")
    const[loginusername,setLoginusername]=useState("")
    const[loginpass,setLoginpass]=useState("")
    const [show, setShow] = React.useState(false)
    const[show2,setShow2]=React.useState(false)
    const handleClick = () => setShow(!show) 
    const handleClick2 = () => setShow2(!show2)
    useEffect(()=>{async function fetch(){
        const config={
          headers:{
            Authorization:`Bearer ${jwt}`
          }
        }
        const{data:Archive}=await server.get("getarchive",config)
        console.log("Archive:",Archive)
       
      }
       fetch();
      },[jwt])


    const register=async()=>{
      try {
        const { data}=await server.post('register',{
          name:registerusername,
          password:registeruserpass
         })
         console.log(data)
         PushNotify("success","Registration",data,6000)
      } catch (error) {
        PushNotify("error","Registration",`Failed with Error: ${error.response.data}`)
      }
   
       
    }
    const clear_storage=()=>{
      //In logout stage you need to remove all infor from frontend;jwt - user
      localStorage.clear('jwt');
      localStorage.clear('user')
      setJwt("")
      setUser({})
    }
    const login=async()=>{
      try {
        console.log(loginusername,loginpass)
        const {
          data
        } = await server.post(`login`, 
        {
              name:loginusername,
              password:loginpass
        },
        );
        PushNotify("success","Wellcome","You'r logged in ♥",6000)
        console.log(data)
        window.localStorage.setItem('jwt',data.jwt)
        window.localStorage.setItem('user',(data.user.name))
        setJwt(data.jwt)
        setUser(data.user.name)
      } catch (error) {
        PushNotify("error","Auth Error",`Authentication failed ${error.response.data}`,6000)
      }
    }
  return (
<>
    {!jwt?
    <Box>
    <Box display="flex" justifyContent="space-between">
    <Image src={stake} alt='stake' boxSize='400px' width={"1000"}
    objectFit='cover' />
    <Box display="flex" justifyContent={"left"}></Box>
    <Text alignContent={"center"}><h1><strong>Wellcome to Stake Secure</strong></h1></Text>
    
  </Box>
     <Text align={"center"}><strong>Please login with your user name and password!</strong></Text>
    <Text align={"center"}><strong>If you have not registered Please register down below!</strong></Text>
    <Accordion  allowToggle>
    <AccordionItem>
      <h2>
        <AccordionButton _expanded={{ bg: 'tomato', color: 'white' }} _hover={{ bg: "blue.500" }}>
          <Box as="span" flex='1' textAlign='center'>
           Registration
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
      <Stack spacing={3}   align='center'>
      <InputGroup className='center'
      align={'center'}>
      <Input
        pr='4.5rem'
        placeholder='Enter username' 
        className='center'
        variant='outline' size={'md'}
        onChange={e=>setRegisterusername(e.target.value)}
        />
      </InputGroup>
      <InputGroup className='center'>
      
      <Input
        pr='4.5rem'
        type={show2 ? 'text' : 'password'}
        placeholder='Enter password'
        className='center'
        variant='outline' size={'md'}
        onChange={e=>setRegisteruserpass(e.target.value)}
      />
  
  <InputRightElement width='4.5rem'>
        <Button h='1.00rem' size='sm' onClick={handleClick2}
          >
          {show2 ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
   
    </InputGroup>
    
    <Button colorScheme='linkedin' leftIcon={<EditIcon />}  variant='solid' onClick={register}>Register</Button>
    </Stack>
      </AccordionPanel>
    </AccordionItem>
  
    <AccordionItem>
      <h2>
        <AccordionButton _expanded={{ bg: 'tomato', color: 'white' }} _hover={{ bg: "blue.500" }}>
          <Box as="span" flex='1' textAlign='center'>
           Login
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
      
      <Stack spacing={3}   align='center'>
      <InputGroup className='center'
      align={'center'}>
      <Input
        pr='4.5rem'
        placeholder='Enter username' 
        className='center'
        variant='outline' size={'md'}
        bg={'white'}
        onChange={(e)=>setLoginusername(e.target.value)}
        />
      </InputGroup>
      <InputGroup className='center'>
      
      <Input
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        placeholder='Enter password'
        className='center'
        variant='outline' size={'md'}
        bg={'white'}
        onChange={(e)=>setLoginpass(e.target.value)} 
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.00rem' size='sm' onClick={handleClick}
          >
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
      
   
    </InputGroup>
    
    <Button colorScheme='linkedin'  leftIcon={<CheckCircleIcon />}  variant='solid' onClick={login}>Login</Button>
    </Stack>
      </AccordionPanel>
    </AccordionItem>
  </Accordion></Box>:<Button colorScheme={"red"} onClick={clear_storage}>Log out</Button>
  }
  </>
  )
}


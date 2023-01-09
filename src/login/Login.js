import React, { useEffect, useState } from 'react'
import server from '../server'

export default function Login({jwt,setJwt}) {
    const[registerusername,setRegisterusername]=useState("")
    const[registeruserpass,setRegisteruserpass]=useState("")
    const[loginusername,setLoginusername]=useState("")
    const[loginpass,setLoginpass]=useState("")
     
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
      const { data}=await server.post('register',{
        name:registerusername,
        password:registeruserpass
       })
       console.log(data)
       /* axios({
            method:'POST',
            data:{
            name:registerusername,
            password:registeruserpass
            },
            withCredentials:true,
            url:"https://localhost:3042/register"
        }).then(res=>console.log(res)) */
    }
    const clear_storage=()=>{
      
      localStorage.clear('jwt');
      setJwt("")
      
      
    }
    const login=async()=>{
       const {
        data
      } = await server.post(`login`, 
      {
            name:loginusername,
            password:loginpass
      },
      );
      console.log("Message:",data)
      window.localStorage.setItem('jwt',data.jwt)
      console.log(window.localStorage.getItem('jwt'))
      setJwt(data.jwt)
     /*  await axios({
            method:'POST',
            data:{
            name:loginusername,
            password:loginpass
            },
            withCredentials:true,
            url:"https://express-server-nc6y-asaidoguz.vercel.app/login"
        }).then(res=>{
          
          setLoginstate(res)},(error)=>{
            console.log("Reason:",error)
          }) */
    }
  return (
    <div className='center'>
        <h1><strong>Wellcome to Escrow Contract Maker</strong></h1>
        <p><strong>Please login with your user name and password</strong></p>
        <p><strong>You don't have password ? Please register</strong></p>
        <div>
        <div><h1><strong>Register</strong></h1></div>
        <div className='center'><strong>User Name :</strong><input placeholder='username' onChange={e=>setRegisterusername(e.target.value)}></input></div>
        <div className='center'><strong>User Pass :</strong>&nbsp;<input placeholder='password' onChange={e=>setRegisteruserpass(e.target.value)}></input></div>
        <button className='center'onClick={register}>Submit</button>
        </div>
         <button onClick={clear_storage}>Log out</button>
        <div><h1><strong>Login</strong></h1></div>
        <div className='center'><strong>User Name :</strong><input placeholder='username' onChange={e=>setLoginusername(e.target.value)}></input></div>
        <div className='center'><strong>User Pass :</strong>&nbsp;<input placeholder='password' onChange={e=>setLoginpass(e.target.value)}></input></div>
        <button onClick={login}>Submit</button>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import PushNotify from '../PushNotify'
import server from '../server'

export default function Login({jwt,setJwt,user,setUser}) {
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
      //In logout stage you need to remove all infor from frontend;jwt - user
      localStorage.clear('jwt');
      localStorage.clear('user')
      setJwt("")
      setUser({})
    }
    const login=async()=>{
      try {
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
        PushNotify("error","Auth Error","Authentication failed",6000)
      }
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

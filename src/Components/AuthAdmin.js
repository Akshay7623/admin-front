import React from 'react'

const AuthAdmin = async() => {
   const token = localStorage.getItem('token');
   let isValid;
   if(token){
         isValid = await fetch('http://localhost:5500/api/authadmin',{
                       method:'post',
                       headers:{
                      'Content-Type':'application/json',
                      'Authorization':`Bearer ${token}`
                       } });
        isValid = await isValid.json();
        return isValid;
   }else{
       return false;
   }
}

export default AuthAdmin
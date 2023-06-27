import Hosturl from '../Hosturl';

const AuthAdmin = async() => {
   const token = localStorage.getItem('token');
   let isValid;
   if(token){
         isValid = await fetch(`${Hosturl}/api/authadmin`,{
                       method:'post',
                       headers:{
                      'Content-Type':'application/json',
                      'Authorization':`Bearer ${token}`
                       } });
        isValid = await isValid.json();
        return isValid;
   }else{
       localStorage.clear();
       return {message:false};
   }
}

export default AuthAdmin
import React,{useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom';
import AuthAdmin from './AuthAdmin';

const Login = () => {
  
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();

  const isEmail = (data)=>{
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(data).toLowerCase());
  }

  const hanldeSubmit = (e)=>{
    e.preventDefault();
    if(!isEmail(username)){
      alert('Invalid data please enter valid email id');
      return;
    }
    if(password.toString().length<6){
      alert('Minimum password length must be 6 characters ');
      return;
    }

    fetch('/api/login',{
      method:'post',
      body:JSON.stringify({username:username, password:password}),
      headers:{
        'Content-Type':'application/json'
      }
    }).then((data)=>data.json()).then((finalData)=>{
    
    if(finalData.message === 'ADMIN_BLOCKED'){
      alert('Admin has beem blocked !');
      return;
    }

    if(finalData.message === 'AUTH_FAILED'){
      alert('Invalid username or password');
      return;
    }

    if(finalData.message === 'INVALID_DATA'){
      alert('Invalid username or password');
      return;
    }

     if(finalData.message === 'success'){
      localStorage.setItem('token',finalData.token);
      navigate('/dashboard');
      return;
     }

     
    });



  }
  useEffect(() => {
    AuthAdmin().then((finalData)=>{
      if(finalData){
        navigate('/dashboard');
      }
    });

  }, [])
  
  return (
    <>
    <div className="main-login">
    <section className="wrapper">
      <div className="form signup">
        <header>Login</header>
        <form method="post">
          <input type="text" onChange={(e)=>setUsername(e.target.value)} value={username} placeholder="Username" required />
          <input type="password" onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="Password" required />
          <input onClick={hanldeSubmit} className="bg-white" type="submit" value="Login" />
        </form>
      </div>
    </section>
    </div>
    </>
  )
}

export default Login
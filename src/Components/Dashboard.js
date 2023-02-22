import React,{useEffect,useRef, useState} from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import AuthAdmin from './AuthAdmin';
import SideBar from './SideBar';

const Dashboard= ()=> {

  const [stats,setStats] = useState({
      
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
 
  
  const toggleSidebar = ()=>{
    document.getElementById('nav').classList.toggle("close");
    if(document.getElementById('nav').classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
  }



//   const getStatics = ()=>{
//       fetch('http://localhost:5000/api/getstatics',{
//           method:'get',
//           headers:{
//               'Content-Type':'application/json',
//               'Authorization':`Bearer ${token}`
//           }
//       }).then((data)=>data.json()).then((finalData)=>{
//           console.log(finalData);
//       })
//   }

  useEffect(()=>{
    AuthAdmin().then((finalData)=>{
        if(finalData.message !== 'success'){
          navigate('/');
        }
      });
  },[]);

  return (<>
    <div>
    <SideBar cl1="uil uil-estate active-menu" clOne="active-menu" />

    <section className="dashboard">
        <div className="top">
            <i onClick={toggleSidebar} className="uil uil-bars sidebar-toggle"></i>

            <div className="search-box">
                <i className="uil uil-search"></i>
                <input type="text" placeholder="Search here... only" />
            </div>
            
        </div>

        <div className="dash-content">
            <div className="overview">
                <div className="title">
                    <i className="uil uil-tachometer-fast-alt"></i>
                    <span className="text">Dashboard</span>
                </div>

                <div className="boxes">
                    <div className="box box1">
                        <i className="uil uil-user-circle"></i>
                        <span className="text">Total User</span>
                        <span className="number">50,120</span>
                    </div>
                    <div className="box box2">
                    <i className="uil uil-transaction"></i>
                        <span className="text">Pending Payments</span>
                        <span className="number">20,120</span>
                    </div>
                    <div className="box box3">
                        <i className="uil uil-money-bill"></i>
                        <span className="text">Recharge</span>
                        <span className="number">10,120</span>
                    </div>
                </div>
            </div>

            <div className="activity">
                <div className="title">
                    <i className="uil uil-clock-three"></i>
                    <span className="text">All User</span>
                </div>
           
            </div>
        </div>
    </section>
    </div>

  </>);
}

export default Dashboard;
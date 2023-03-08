import React from 'react'

const DarkMode = () => {
  // const body = document.querySelector("body");
  const [stats,setStats] = useState({
      
});
const sidenav = document.getElementById('nav');
const navigate = useNavigate();
const token = localStorage.getItem('token');


// let getMode = localStorage.getItem("mode");
// let getStatus = localStorage.getItem("status");

// if(getMode && getMode ==="dark"){
//     body.classList.toggle("dark");
// }

// if(getStatus && getStatus ==="close"){
//     sidebar.classList.toggle("close");
// }

const changeMode = ()=>{
  // body.classList.toggle("dark");
  // if(body.classList.contains("dark")){
  //     localStorage.setItem("mode", "dark");
  // }else{
  //     localStorage.setItem("mode", "light");
  // }
}

const toggleSidebar = ()=>{
  sidenav.classList.toggle("close");
  if(sidenav.classList.contains("close")){
      localStorage.setItem("status", "close");
  }else{
      localStorage.setItem("status", "open");
  }
}

const logout = ()=>{
    localStorage.removeItem('token');
    AuthAdmin().then((data)=>{
      if(data.message  !=='success'){
          navigate('/');
        }
    });
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




  return (
    <>
    <div>
     <nav id="nav" ref={sidenav}>
        <div className="logo-name">
            <div className="logo-image">
            </div>
            <span className="logo_name">777.in</span>
        </div>
        <div className="menu-items">
            <ul className="nav-links">
                <li>
                <NavLink to="/dashboard">
                    <i className="uil uil-estate active-menu"></i>
                    <span className="link-name active-menu">Dahsboard</span>
                </NavLink></li>
                <li><NavLink to="/user">
                <i className="uil uil-user-circle"></i>
                    <span className="link-name">User Management</span>
                </NavLink></li>
                <li><NavLink to="/recharge">
                    <i className="uil uil-transaction"></i>
                    <span className="link-name">Recharge</span>
                </NavLink></li>
                <li><NavLink to="/">
                <i className="uil uil-money-bill"></i>
                    <span className="link-name">Wthdrawal </span>
                </NavLink></li>
                <li><NavLink to="/">
                    <i className="uil uil-comments"></i>
                    <span className="link-name">Comment</span>
                </NavLink></li>
                <li>
                <NavLink to="/">
                    <i className="uil uil-share"></i>
                    <span className="link-name">Share</span>
                </NavLink></li>
            </ul>
            
            <ul className="logout-mode">
                <li>
                <a onClick={logout} href="#javascript">
                    <i className="uil uil-signout"></i>
                    <span  className="link-name">Logout</span>
                </a></li>

                <li className="mode">
                    <a href="/">
                        <i className="uil uil-moon"></i>
                    <span className="link-name">Dark Mode</span>
                </a>
                <div onClick={changeMode} className="mode-toggle">
                  <span className="switch"></span>
                </div>
            </li>
            </ul>
        </div>
    </nav>

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

  </>
  )
}

export default DarkMode;
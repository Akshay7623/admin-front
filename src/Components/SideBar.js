import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import AuthAdmin from './AuthAdmin';

const SideBar = (props) => {

    const navigate = useNavigate();
    const changeMode = ()=>{
        console.log('changing a mode ');
    }

    const logout = ()=>{
        localStorage.removeItem('token');
        AuthAdmin().then((data)=>{
          if(data.message  !=='success'){
              navigate('/');
            }
        });
    }
    
    const linkName = "link-name";

  return (
    <>
     <nav id="nav">
        <div className="logo-name">
            <div className="logo-image">
            </div>
            <span className="logo_name">777.in</span>
        </div>
        <div className="menu-items">
            <ul className="nav-links">
                <li>
                <NavLink to="/dashboard">
                    <i className={props.cl1}></i>
                    <span className={`${linkName} ${props.clOne}` }>Dahsboard</span>
                </NavLink></li>
                <li><NavLink to="/user">
                <i className={props.cl2}></i>
                    <span className={`${linkName} ${props.clTwo}` }>User Management</span>
                </NavLink></li>
                <li><NavLink to="/recharge">
                    <i className={props.cl3}></i>
                    <span className={`${linkName} ${props.clThree}` }>Recharge</span>
                </NavLink></li>
                <li><NavLink to="/withdrawal">
                <i className={props.cl4}></i>
                    <span className={`${linkName} ${props.clFour}` }>Wthdrawal </span>
                </NavLink></li>
                <li>
                <NavLink to="/sessions/parity">
                    <i className={props.cl5}></i>
                    <span className={`${linkName} ${props.clFive}` }>Sessions</span>
                </NavLink></li>
                <li><NavLink to="/complains">
                    <i className={props.cl6}></i>
                    <span className={`${linkName} ${props.clSix}` }>Complaints</span>
                </NavLink></li>
                <li><NavLink to="/bonus">
                    <i className={props.cl7}></i>
                    <span className={`${linkName} ${props.clSeven}` }>Bonus</span>
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
    </>
  )
}

SideBar.defaultProps = {
    cl1:'uil uil-estate',
    cl2:'uil uil-user-circle',
    cl3:'uil uil-transaction',
    cl4:'uil uil-money-bill',
    cl5:'uil uil-chart-line',
    cl6:'uil uil-comments',
    cl7:'uil uil-gift',
    clOne:'',
    clTwo:'',
    clThree:'',
    clFour:'',
    clFive:'',
    clSix:'',
    clSeven:''
  }

export default SideBar
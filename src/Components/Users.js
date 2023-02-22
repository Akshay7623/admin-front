import React,{useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAdmin from './AuthAdmin';
import SideBar from './SideBar';

const Users= ()=> {

  let x = new Date().getTime();
  const [search,setSearch] = useState('');
  const [lastTime,setLastTime] = useState(x);
  const [firstBetTime,setFirstBetTime] = useState(0);
  const [users, setUsers] = useState({});
  const [currePageNo,setCurrePageNo] = useState(1);
  const [totalDoc,setTotalDoc] = useState(0);
  const perPageDoc = 10;
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const hanldeWallet = (e)=>{
    let newBal = prompt('Please enter new balance ');
    console.log(newBal);

    if(parseInt(newBal)>0){
        console.log('now go');
        fetch('http://localhost:5500/api/updatewallet',{
            method:'post',
            body:JSON.stringify({id:e.target.id,newBal:newBal}),
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
        }).then((data)=>data.json()).then((finalData)=>{
            if(finalData.message === 'success'){
                showToast('Balance Updated successfully');
            }else{
                showToast('Failed to update');
            }
        })
    }else{
        showToast('Please enter valid amount');
    }
  }
  const hanldeSearch = (e)=>{
      if(e.key === 'Enter'){
 
        if(search.length !==10){
            alert('Please enter valid ID');
            return;
        }
        fetch('http://localhost:5500/api/searchuser',{
        method:'post',
        body:JSON.stringify({search:search}),
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
        }).then((data)=>data.json()).then((finalData)=>{
        console.log(finalData.users);
        setUsers(finalData.users);
        setTotalDoc(finalData.count)
        setLastTime(Object.values(finalData.users)[Object.values(finalData.users).length - 1].time);
        setFirstBetTime((finalData.users)['0'].time);
        });
      }
  }

  const toggleSidebar = ()=>{
    document.getElementById('nav').classList.toggle("close");
    if(document.getElementById('nav').classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
  }

  const handleNext  = ()=>{
    if(currePageNo !== Math.ceil(totalDoc/perPageDoc)){
        setCurrePageNo(currePageNo+1);
        fetch('http://localhost:5500/api/getalluser',{
            method:'post',
            body:JSON.stringify({type:'next',lastTime:lastTime,firstBetTime:firstBetTime}),
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
            }).then((data)=>data.json()).then((finalData)=>{
            console.log(finalData.users);
            setUsers(finalData.users);
            setTotalDoc(finalData.count)
            setLastTime(Object.values(finalData.users)[Object.values(finalData.users).length - 1].time);
            setFirstBetTime((finalData.users)['0'].time);
            });
      }
  }
  
  const handlePrev  = ()=>{
      if(currePageNo !==1){
        setCurrePageNo(currePageNo-1);
        fetch('http://localhost:5500/api/getalluser',{
        method:'post',
        body:JSON.stringify({type:'prev',lastTime:lastTime,firstBetTime:firstBetTime}),
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
        }).then((data)=>data.json()).then((finalData)=>{
        let finalObj = {};
        let ObjKey = Object.keys(finalData.users);
        let ObjVal = Object.values(finalData.users).reverse();
        ObjKey.map((val,index)=>{
            finalObj[index] = ObjVal[val];
        });
        console.log(finalObj);
        setUsers(finalObj);
        setTotalDoc(finalData.count)
        setLastTime(Object.values(finalObj)[Object.values(finalObj).length - 1].time);
        setFirstBetTime((finalObj)['0'].time);
        });
      }
  }


  function showToast(message) {
    var x = document.getElementById("snackbar");
    x.innerHTML=message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

  const disableUser = (e)=>{
   let userId = e.target.getAttribute('data-id');
   let dec = window.confirm('Are you sure want to Disable this user');
   if(dec){
    fetch('http://localhost:5500/api/useraction',{
        method:'post',
        body:JSON.stringify({event:'disable',id:userId}),
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
        }).then((data)=>data.json()).then((finalData)=>{
            if(finalData.message === 'success'){
                showToast('User disable successfully ');
            }
        });
    }
   }

  const enableUser  = (e)=>{
   let userId = e.target.getAttribute('data-id');
   let dec = window.confirm('Are you sure want to Enable this user');
   if(dec){
    fetch('http://localhost:5500/api/useraction',{
        method:'post',
        body:JSON.stringify({event:'enable',id:userId}),
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
        }).then((data)=>data.json()).then((finalData)=>{
            if(finalData.message === 'success'){
                showToast('User enabled successfully ');
            }
        });
   }
  }


  useEffect(()=>{
    AuthAdmin().then((finalData)=>{
        if(finalData.message !== 'success'){
          navigate('/');
        }
      });

      fetch('http://localhost:5500/api/getalluser',{
        method:'post',
        body:JSON.stringify({type:'next',lastTime:x,firstBetTime:0}),
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
        }).then((data)=>data.json()).then((finalData)=>{
        console.log(finalData.users);
        setUsers(finalData.users);
        setTotalDoc(finalData.count)
        setLastTime(Object.values(finalData.users)[Object.values(finalData.users).length - 1].time);
        setFirstBetTime((finalData.users)['0'].time);
        });
   },[]);

  return (
    <div>
    <SideBar cl2="uil uil-user-circle active-menu" clTwo="active-menu" />
    <div id="snackbar"></div>
    <section className="dashboard">
        <div className="top">
            <i onClick={toggleSidebar} className="uil uil-bars sidebar-toggle"></i>
            <div className="search-box">
                <i className="uil uil-search"></i>
                <input onKeyDown={hanldeSearch} type="text" onChange={(e)=>setSearch(e.target.value)} placeholder="Search here with ID (Refer code)" />
            </div>
        </div>
        <div className="dash-content">
            <div className="activity">
                <div className="title">
                    <i className="uil uil-clock-three"></i>
                    <span className="text">All User</span>
                </div>
            </div>
<div className="table">
        <div className="TableRow heading">
            <div className="TableColumn">SN no. </div>
            <div className="TableColumn">Mobile</div>
            <div className="TableColumn">ID</div>
            <div className="TableColumn">Wallet</div>
            <div className="TableColumn">Date</div>
            <div className="TableColumn">Edit Balance</div>
            <div className="TableColumn">Disable/Enable User</div>
</div>

{
    Object.values(users).map((val,index)=>{
        return(
        <div key={val._id} className="TableRow">
            <div className="TableColumn">{((currePageNo - 1)*perPageDoc) + (index+1)}</div>
            <div className="TableColumn">{val.mobile}</div>
            <div className="TableColumn">{val.ReferCode}</div>
            <div className="TableColumn">{val.wallet}</div>
            <div className="TableColumn">{ (new Date(val.time).getDate())<10 ?`0${(new Date(val.time).getDate())}` :(new Date(val.time).getDate()) }-{(new Date(val.time).getMonth() + 1)<10 ?`0${(new Date(val.time).getMonth() + 1)}` :(new Date(val.time).getMonth() + 1) }-{new Date(val.time).getFullYear()} {new Date(val.time).toLocaleTimeString()}</div>
            <div className="TableColumn"><button id={val._id} className="edit-wallet" onClick={hanldeWallet}>Edit Wallet</button></div>
            {val.isV===1?<div className="TableColumn"><button data-id={val._id} className="edit-disable" onClick={disableUser}>Disable</button></div>  : <div className="TableColumn"><button data-id={val._id} className="edit-enable" onClick={enableUser}>Enable</button></div> }
        </div>
      );
    })
}

</div>
        </div>
            <div className="flex flex-row justify-around">
                <div onClick={handlePrev}><i className="uil uil-angle-left-b text-[30px] cursor-pointer bg-slate-300 rounded-[10px]"></i></div>
                <div className="mt-[10px]"><span>{currePageNo}/</span>{Math.ceil(totalDoc/perPageDoc)}</div>
                <div onClick={handleNext}><i className="uil uil-angle-right text-[30px] cursor-pointer bg-slate-300 rounded-[10px]"></i></div>
            </div>
    </section>


    </div>
  );
}

export default Users;
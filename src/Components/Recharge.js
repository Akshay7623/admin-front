import React,{useRef,useEffect, useState} from 'react'
import { NavLink,useNavigate} from 'react-router-dom';
import AuthAdmin from './AuthAdmin';
import SideBar from './SideBar';
import Hosturl from '../Hosturl';

const Recharge = () => {
   

    let x = new Date().getTime();
    const [search,setSearch] = useState('');
    const [lastTime,setLastTime] = useState(x);
    const [firstBetTime,setFirstBetTime] = useState(0);
    const [recharge, setRecharge] = useState({});
    const [currePageNo,setCurrePageNo] = useState(1);
    const [totalDoc,setTotalDoc] = useState(0);
    const perPageDoc = 20;

    const [upidata,setUpidata] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    function showToast(message) {
        var x = document.getElementById("snackbar");
        x.innerHTML=message;
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      }

    const toggleSidebar = ()=>{
        document.getElementById('nav').classList.toggle("close");
        if(document.getElementById('nav').classList.contains("close")){
            localStorage.setItem("status", "close");
        }else{
            localStorage.setItem("status", "open");
        }
      }
     
    const deleteUpi = (e)=>{

        fetch(`${Hosturl}/api/delete`,{
            method:'post',
            body:JSON.stringify({id:e.target.id}),
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
          }).then((data)=>data.json()).then((finalData)=>{
              if(finalData.message === 'success'){
            showToast('UPI Deleted successfully !');
                  fetch(`${Hosturl}/api/showupi`,{
                      method:'get',
                      headers:{
                          'Content-Type':'application/json',
                          'Authorization':`Bearer ${token}`
                      }
                      }).then((data)=>data.json()).then((finalData)=>{
                          setUpidata(finalData);
                      })
              }
          });

    }

    const addUPI = ()=>{
      let upi = prompt('Enter new upi id');
      fetch(`${Hosturl}/api/addupi`,{
        method:'post',
        body:JSON.stringify({upi:upi}),
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
      }).then((data)=>data.json()).then((finalData)=>{
          if(finalData.message === 'success'){
            showToast('New UPI added successfully ');
              fetch(`${Hosturl}/api/showupi`,{
                  method:'get',
                  headers:{
                      'Content-Type':'application/json',
                      'Authorization':`Bearer ${token}`
                  }
                  }).then((data)=>data.json()).then((finalData)=>{
                      setUpidata(finalData);
                  })
          }
      });
    
    }

    const handlePrev  = ()=>{
        if(currePageNo !==1){
          setCurrePageNo(currePageNo-1);
          fetch(`${Hosturl}/api/getrecharge`,{
          method:'post',
          body:JSON.stringify({type:'prev',lastTime:lastTime,firstBetTime:firstBetTime}),
          headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${token}`
          }
          }).then((data)=>data.json()).then((finalData)=>{
          let finalObj = {};
          let ObjKey = Object.keys(finalData.recharge);
          let ObjVal = Object.values(finalData.recharge).reverse();
          ObjKey.map((val,index)=>{
              finalObj[index] = ObjVal[val];
          });
          console.log(finalObj);
          setRecharge(finalObj);
          setTotalDoc(finalData.count);
          setLastTime(Object.values(finalObj)[Object.values(finalObj).length - 1].time);
          setFirstBetTime((finalObj)['0'].time);
          });
        }
    }

    const handleNext  = ()=>{
        if(currePageNo !== Math.ceil(totalDoc/perPageDoc)){
            setCurrePageNo(currePageNo+1);
            fetch(`${Hosturl}/api/getrecharge`,{
                method:'post',
                body:JSON.stringify({type:'next',lastTime:lastTime,firstBetTime:firstBetTime}),
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                }
                }).then((data)=>data.json()).then((finalData)=>{
                console.log(finalData.recharge);
                setRecharge(finalData.recharge);
                setTotalDoc(finalData.count);
                setLastTime(Object.values(finalData.recharge)[Object.values(finalData.recharge).length - 1].time);
                setFirstBetTime((finalData.recharge)['0'].time);
                });
          }
      }

    const ApproveRecharge = (e)=>{
        let con = window.confirm('Are you sure want to approve this recharge ?');
        if(con){
        fetch(`${Hosturl}/api/approverecharge`,{
            method:'post',
            body:JSON.stringify({id:e.target.id}),
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
        }).then((data)=>data.json()).then((finalData)=>{
            if(finalData.message === 'success'){
              //here we are going to refresh new data and toast message
            e.target.innerHTML = 'Done';
            showToast('Recharge successfull ');
            }
        });
        }
     }
 
     const RejectRecharge = (e)=>{
        let con = window.confirm('Are you sure want to reject this recharge ?');
        if(con){
            fetch(`${Hosturl}/api/rejectrecharge`,{
                method:'post',
                body:JSON.stringify({id:e.target.id}),
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                }
            }).then((data)=>data.json()).then((finalData)=>{
                if(finalData.message === 'success'){
                  //here we are going to refresh new data and toast message
                e.target.innerHTML = 'Done';
                showToast('Rejected successfull ');
                }
            });
        }
     }


     const hanldeSearch = (e)=>{
        if(e.key === 'Enter'){
   
          if(search.length !==12){
              alert('Please enter valid UTR No');
              return;
          }
          fetch(`${Hosturl}/api/searchrecharge`,{
          method:'post',
          body:JSON.stringify({search:search}),
          headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${token}`
          }
          }).then((data)=>data.json()).then((finalData)=>{
            console.log(finalData.recharge);
            setRecharge(finalData.recharge);
            setTotalDoc(finalData.count);
            setLastTime(Object.values(finalData.recharge)[Object.values(finalData.recharge).length - 1].time);
            setFirstBetTime((finalData.recharge)['0'].time);
          });
        }
      }


      useEffect(()=>{
        AuthAdmin().then((finalData)=>{
            if(finalData.message !== 'success'){
              navigate('/');
            }
          });
      fetch(`${Hosturl}/api/showupi`,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
            }).then((data)=>data.json()).then((finalData)=>{
                setUpidata(finalData);
            });
    
     fetch(`${Hosturl}/api/getrecharge`,{
                method:'post',
                body:JSON.stringify({type:'next',lastTime:0,firstBetTime:0}),
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                }
                }).then((data)=>data.json()).then((finalData)=>{
                setRecharge(finalData.recharge);
                setTotalDoc(finalData.count);
                setLastTime(Object.values(finalData.recharge)[Object.values(finalData.recharge).length - 1].time);
                setFirstBetTime((finalData.recharge)['0'].time);
                });
        },[]);

  return (
    <>
    <div>
    <SideBar cl3="uil uil-transaction active-menu" clThree="active-menu" />
    <div id="snackbar"></div>
    <section className="dashboard">
        <div className="top">
            <i onClick={toggleSidebar} className="uil uil-bars sidebar-toggle"></i>
        <div className="search-box">
                <i className="uil uil-search"></i>
                <input type="text" name="search" onKeyDown={hanldeSearch} value={search} onChange={(e)=>setSearch(e.target.value)} maxLength="12" placeholder="Search here with (UTR No)" />
            </div>
        </div>

        <div className="dash-content">
        <div className="activity">
                <div className="title">
                    <i className="uil uil-clock-three"></i>
                    <span className="text">All UPI ID</span>
                </div>
        </div>
        <div className="table">
        <div className="TableRow heading">
            <div className="TableColumn">SN no. </div>
            <div className="TableColumn">UPI ID</div>
            <div className="TableColumn">Delete</div>
        </div>

        {
            Object.values(upidata).map((val,index)=>{
                return( 
        <div key={val._id} className="TableRow">
            <div className="TableColumn">{index+1}</div>
            <div className="TableColumn">{val.upi}</div>
            <div className="TableColumn"><button className="delete-btn" onClick={deleteUpi} id={val._id}>Delete</button></div>
        </div>
            );
            })
        }
        </div>

        <button className="add-btn" onClick={addUPI}> Add UPI</button>
            <div className="activity">
                <div className="title">
                    <i className="uil uil-clock-three"></i>
                    <span className="text">All Recharges</span>
                </div>
            </div>

        <div className="TableRow w-[100%] heading">
            <div className="TableColumn-recharge w-[40px]">No</div>
            <div className="TableColumn-recharge w-[100px]">Mobile</div>
            <div className="TableColumn-recharge w-[130px]">UTR No</div>
            <div className="TableColumn-recharge w-[70px]">Amount</div>
            <div className="TableColumn-recharge w-[250px]">Date & time</div>
            <div className="TableColumn-recharge w-[200px]">UPI</div>
            <div className="TableColumn-recharge px-[6.5px]">Approve</div>
            <div className="TableColumn-recharge px-[9px]">Reject</div>
        </div>
            {
    Object.values(recharge).map((val,index)=>{
        return(
        <div key={val._id} className="TableRow w-[100%]">
            <div className="TableColumn-recharge w-[40px]">{((currePageNo - 1)*perPageDoc) + (index+1)}</div>
            <div className="TableColumn-recharge w-[100px]">{val.mobile}</div>
            <div className="TableColumn-recharge w-[130px]">{val.UTR}</div>
            <div className="TableColumn-recharge w-[70px]">{val.rechargeAmount}</div>
            <div className="TableColumn-recharge w-[250px]">{ (new Date(val.time).getDate())<10 ?`0${(new Date(val.time).getDate())}` :(new Date(val.time).getDate()) }-{(new Date(val.time).getMonth() + 1)<10 ?`0${(new Date(val.time).getMonth() + 1)}` :(new Date(val.time).getMonth() + 1) }-{new Date(val.time).getFullYear()} {new Date(val.time).toLocaleTimeString()}</div>
            <div className="TableColumn-recharge w-[200px]">{val.toUpi}</div>
            <div className="TableColumn-recharge px-[15px]"><button id={val._id} onClick={ApproveRecharge} className="edit-enable">Approve</button></div>
            <div className="TableColumn-recharge px-[15px]"><button id={val._id} onClick={RejectRecharge} className="edit-wallet">Reject</button></div>
        </div>
      );
    })
    }
            <div className="flex flex-row justify-around">
                <div onClick={handlePrev}><i className="uil uil-angle-left-b text-[30px] cursor-pointer bg-slate-300 rounded-[10px]"></i></div>
                <div className="mt-[10px]"><span>{currePageNo}/</span>{Math.ceil(totalDoc/perPageDoc)}</div>
                <div onClick={handleNext}><i className="uil uil-angle-right text-[30px] cursor-pointer bg-slate-300 rounded-[10px]"></i></div>
            </div>
        </div>
    </section>
    </div>

    </>
  )
}

export default Recharge
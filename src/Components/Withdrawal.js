import React, {useEffect, useState} from 'react'
import { NavLink,useNavigate} from 'react-router-dom';
import AuthAdmin from './AuthAdmin';
import SideBar from './SideBar';


const Withdrawal = () => {

    let x = new Date().getTime();
    const [search,setSearch] = useState('');
    const [lastTime,setLastTime] = useState(x);
    const [firstWithTime,setFirstWithTime] = useState(0);
    const [withdraw, setWithdraw] = useState({});
    const [currePageNo,setCurrePageNo] = useState(1);
    const [totalDoc,setTotalDoc] = useState(0);
    const perPageDoc = 20;

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    function showToast(message) {
        var x = document.getElementById("snackbar");
        x.innerHTML=message;
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      }

    const handlePrev  = ()=>{
        if(currePageNo !==1){
          setCurrePageNo(currePageNo-1);
          fetch('/api/getwithdraw',{
          method:'post',
          body:JSON.stringify({type:'prev',lastTime:lastTime,firstWithTime:firstWithTime}),
          headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${token}`
          }
          }).then((data)=>data.json()).then((finalData)=>{
          let finalObj = {};
          let ObjKey = Object.keys(finalData.withdraw);
          let ObjVal = Object.values(finalData.withdraw).reverse();
          ObjKey.map((val,index)=>{
              finalObj[index] = ObjVal[val];
          });
          console.log(finalObj);
          setWithdraw(finalObj);
          setTotalDoc(finalData.count);
          setLastTime(Object.values(finalObj)[Object.values(finalObj).length - 1].time);
          setFirstWithTime((finalObj)['0'].time);
          });
        }
       }

    const handleNext  = ()=>{
        if(currePageNo !== Math.ceil(totalDoc/perPageDoc)){
            setCurrePageNo(currePageNo+1);
            fetch('/api/getwithdraw',{
                method:'post',
                body:JSON.stringify({type:'next',lastTime:lastTime,firstWithTime:firstWithTime}),
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                }
                }).then((data)=>data.json()).then((finalData)=>{
                console.log(finalData.withdraw);
                setWithdraw(finalData.withdraw);
                setTotalDoc(finalData.count);
                setLastTime(Object.values(finalData.withdraw)[Object.values(finalData.withdraw).length - 1].time);
                setFirstWithTime((finalData.withdraw)['0'].time);
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


    const ApproveWithdraw = (e)=>{
        fetch('/api/approvewithdraw',{
            method:'post',
            body:JSON.stringify({id:e.target.id}),
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
        }).then((data)=>data.json()).then((finalData)=>{
            console.log(finalData);
            if(finalData.message === 'success'){
                showToast('Approved Successfully');
                e.target.innerHTML = 'Done';
            }else{
                showToast('Some server error');
            }
        });
    }

    const RejectWithdraw = (e)=>{
        fetch('/api/rejectwithdraw',{
            method:'post',
            body:JSON.stringify({id:e.target.id}),
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
        }).then((data)=>data.json()).then((finalData)=>{
            console.log(finalData);
            if(finalData.message === 'success'){
                showToast('Rejected Successfully');
                e.target.innerHTML = 'Done';
            }else{
                showToast('Some server error');
            }
        });
    }

    const ApproveRazorpay = (e)=>{
        fetch('/api/approverazorpay',{
            method:'post',
            body:JSON.stringify({id:e.target.id}),
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
        }).then((data)=>data.json()).then((finalData)=>{
            console.log(finalData);
            if(finalData.message === 'success'){
                e.target.innerHTML = 'Done';
                showToast('Money transeferred Successfully ');
            }
            if(finalData.message === 'ERROR'){
                showToast('Some error ');
            }
        });
    }

    const hanldeSearch = (e)=>{
        if(e.key === 'Enter'){
          if(search.length === 0){
              alert('Please enter valid upi or bank account No');
              return;
          }
          fetch('/api/searchwithdraw',{
          method:'post',
          body:JSON.stringify({search:search}),
          headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${token}`
          }
          }).then((data)=>data.json()).then((finalData)=>{
                console.log(finalData.withdraw);
                setWithdraw(finalData.withdraw);
                setTotalDoc(finalData.count);
                setLastTime(Object.values(finalData.withdraw)[Object.values(finalData.withdraw).length - 1].time);
                setFirstWithTime((finalData.withdraw)['0'].time);
            
          });
        }
      }
      
    useEffect(()=>{
        AuthAdmin().then((finalData)=>{
            if(finalData.message !== 'success'){
            navigate('/');
            }
        });

        fetch('/api/getwithdraw',{
            method:'post',
            body:JSON.stringify({type:'next',lastTime:0,firstWithTime:0}),
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
        }).then((data)=>data.json()).then((finalData)=>{
            console.log(finalData.withdraw);
            setWithdraw(finalData.withdraw);
            setTotalDoc(finalData.count);
            setLastTime(Object.values(finalData.withdraw)[Object.values(finalData.withdraw).length - 1].time);
            setFirstWithTime((finalData.withdraw)['0'].time);
        });
        
    },[]);

  return (
    <>
   <div>
    <SideBar cl4="uil uil-money-bill active-menu" clFour="active-menu"/>
    <div id="snackbar"></div>
    <section className="dashboard">
        <div className="top">
            <i onClick={toggleSidebar} className="uil uil-bars sidebar-toggle"></i>

            <div className="search-box">
                <i className="uil uil-search"></i>
                <input type="text" name="search" onKeyDown={hanldeSearch} value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search here with (UPI or bank account)" autoComplete="off"/>
            </div>
            
        </div>

        <div className="dash-content">
            <div className="activity">
                <div className="title">
                    <i className="uil uil-clock-three"></i>
                    <span className="text">All Withdrawals</span>
                </div>
                
        <div  className="TableRow w-[100%] heading">
        <div className="TableColumn-recharge w-[40px]">No</div>
            <div className="TableColumn-recharge w-[100px]">Mobile</div>
            <div className="TableColumn-recharge w-[130px]">Name</div>
            <div className="TableColumn-recharge w-[70px]">Amount</div>
            <div className="TableColumn-recharge w-[250px]">Date & Time</div>
            <div className="TableColumn-recharge w-[200px]">Bank or UPI</div>
            <div className="TableColumn-recharge w-[150px]">IFSC code</div>
            <div className="TableColumn-recharge px-[15px]">Approve</div>
            <div className="TableColumn-recharge px-[15px]">Razorpay</div>
            <div className="TableColumn-recharge px-[15px]">Reject</div>
        </div>
  {
    Object.values(withdraw).map((val,index)=>{
        return(
        <div key={val._id} className="TableRow w-[100%]">
            <div className="TableColumn-recharge w-[40px]">{((currePageNo - 1)*perPageDoc) + (index+1)}</div>
            <div className="TableColumn-recharge w-[100px]">{val.mobile}</div>
            <div className="TableColumn-recharge w-[130px]">{val.name}</div>
            <div className="TableColumn-recharge w-[70px]">{val.withdrawAmount}</div>
            <div className="TableColumn-recharge w-[250px]">{ (new Date(val.time).getDate())<10 ?`0${(new Date(val.time).getDate())}` :(new Date(val.time).getDate()) }-{(new Date(val.time).getMonth() + 1)<10 ?`0${(new Date(val.time).getMonth() + 1)}` :(new Date(val.time).getMonth() + 1) }-{new Date(val.time).getFullYear()} {new Date(val.time).toLocaleTimeString()}</div>
            <div className="TableColumn-recharge w-[200px]">{val.source}</div>
            <div className="TableColumn-recharge w-[150px]">{val.ifsc}</div>
            <div className="TableColumn-recharge px-[15px]"><button id={val._id} onClick={ApproveWithdraw} className="edit-enable">Approve</button></div>
            <div className="TableColumn-recharge px-[15px]"><button id={val._id} onClick={ApproveRazorpay} className="edit-enable">Razorpay</button></div>
            <div className="TableColumn-recharge px-[15px]"><button id={val._id} onClick={RejectWithdraw} className="edit-wallet">Reject</button></div>
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
        </div>
    </section>
    </div>
    </>
  )
}

export default Withdrawal
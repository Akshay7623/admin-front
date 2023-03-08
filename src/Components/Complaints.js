import React,{useEffect,useState} from 'react';
import AuthAdmin from './AuthAdmin';
import { useNavigate } from 'react-router';
import SideBar from './SideBar';

const Complaints = () => {
  let x = new Date().getTime();
  const [search,setSearch] = useState('');
  const [lastTime,setLastTime] = useState(x);
  const [firstWithTime,setFirstWithTime] = useState(0);
  const [complaints, setComplaints] = useState('');
  const [currePageNo,setCurrePageNo] = useState(1);
  const [totalDoc,setTotalDoc] = useState(0);
  const [activeId,setActiveId] = useState('');
  const [solution,setSolution] = useState('');
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
        fetch('/api/getcomplains',{
        method:'post',
        body:JSON.stringify({type:'prev',lastTime:lastTime,firstWithTime:firstWithTime}),
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
        }).then((data)=>data.json()).then((finalData)=>{
        let finalObj = {};
        let ObjKey = Object.keys(finalData.Complaints);
        let ObjVal = Object.values(finalData.Complaints).reverse();
        ObjKey.map((val,index)=>{
            finalObj[index] = ObjVal[val];
        });
        setComplaints(finalObj);
        setTotalDoc(finalData.count);
        setLastTime(Object.values(finalObj)[Object.values(finalObj).length - 1].time);
        setFirstWithTime((finalObj)['0'].time);
        });
      setCurrePageNo(currePageNo-1);
      }
    }

  const handleNext  = ()=>{
      if(currePageNo !== Math.ceil(totalDoc/perPageDoc)){
          fetch('/api/getcomplains',{
              method:'post',
              body:JSON.stringify({type:'next',lastTime:lastTime,firstWithTime:firstWithTime}),
              headers:{
                  'Content-Type':'application/json',
                  'Authorization':`Bearer ${token}`
              }
              }).then((data)=>data.json()).then((finalData)=>{
              setComplaints(finalData.Complaints);
              setTotalDoc(finalData.count);
              setLastTime(Object.values(finalData.Complaints)[Object.values(finalData.Complaints).length - 1].time);
              setFirstWithTime((finalData.Complaints)['0'].time);
              });
          setCurrePageNo(currePageNo+1);
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

   const OpenRuleModal = (id,title,query)=>{
    document.getElementById('rule-modal').classList.add('show-submenu');
    document.getElementById("modal-background").classList.add("show-submenu");
    document.getElementById('title').innerHTML = title;
    document.getElementById('query').innerHTML = query;
    setActiveId(id);
    }

   const closeRuleModal = ()=>{
        document.getElementById('rule-modal').classList.remove('show-submenu');
        document.getElementById("modal-background").classList.remove("show-submenu");
        setSolution('');
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
              setComplaints(finalData.Complaints);
              setTotalDoc(finalData.count);
              setLastTime(Object.values(finalData.Complaints)[Object.values(finalData.Complaints).length - 1].time);
              setFirstWithTime((finalData.Complaints)['0'].time);
          
        });
      }
    }

  const submitSolution = ()=>{
      if(solution.toString().trim() === ''){
        showToast('Please write something');  
        return;
      }
      fetch('/api/setcomplains',{
        method:'post',
        body:JSON.stringify({id:activeId,solution:solution}),
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        }
      }).then((data)=>data.json()).then((finalData)=>{
          
          if(finalData.message==='success'){
             document.getElementById(activeId).disabled = true;
             document.getElementById(activeId).innerHTML = 'Solved';
             closeRuleModal();
             setSolution('');
             showToast('Submitted successfully');

          }else{
              showToast('Some error occurred');
          }
      });
   }
    
  useEffect(()=>{
      AuthAdmin().then((finalData)=>{
          if(finalData.message !== 'success'){
          navigate('/');
          }
      });

      fetch('/api/getcomplains',{
          method:'post',
          body:JSON.stringify({type:'next',lastTime:0,firstWithTime:0}),
          headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${token}`
          }
      }).then((data)=>data.json()).then((finalData)=>{
          setComplaints(finalData.Complaints);
          setTotalDoc(finalData.count);
          setLastTime(Object.values(finalData.Complaints)[Object.values(finalData.Complaints).length - 1].time);
          setFirstWithTime((finalData.Complaints)['0'].time);
      });

  },[]);

  return (
    <>
        <SideBar cl6="uil uil-comments active-menu" clSix="active-menu" />
    
        <div id="modal-background" className="modal-background hide-submenu"></div>

    <div id="rule-modal" className="rule-modal w-[90%] ml-[5%] setRuleModal">
      <div className="rule-modal-content">
      <div className="rule-modal-title bg-white" id="title"></div>
      <div className="w-[100%] flex flex-col p-[12px] text-[10px] leading-[20px] overflow-auto">
     <p id="query"> </p>
      <textarea type="text" className="solution-textarea" autoComplete="off" placeholder="Write solution" value={solution} onChange={(e)=>setSolution(e.target.value)} />
      </div>
     <div className="flex relative flex-1 items-center min-h-[60px] justify-center bg-white">
     <div className="close-btn-first close-btn-second rule-close-btn" onClick={closeRuleModal}>CLOSE</div>
     <div className="close-btn-first close-btn-second rule-close-btn" onClick={submitSolution}>SUBMIT</div>
     </div>
      </div>      
   </div>


        <div id="snackbar"></div>
    <section className="dashboard">
        <div className="top">
            <i onClick={toggleSidebar} className="uil uil-bars sidebar-toggle"></i>
        <div className="search-box">
                <i className="uil uil-search"></i>
                <input type="text" name="search" onKeyDown={hanldeSearch} value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search here with (UTR No)"  autoComplete="off"/>
            </div>
        </div>

        <div className="dash-content">
        <div className="activity">
                <div className="title">
                    <i className="uil uil-clock-three"></i>
                    <span className="text">All Complains</span>
                </div>

                <div  className="TableRow w-[100%] heading">
        <div className="TableColumn-recharge w-[40px]">No</div>
            <div className="TableColumn-recharge w-[100px]">Mobile</div>
            <div className="TableColumn-recharge w-[200px]">Type</div>
            <div className="TableColumn-recharge w-[400px]">Query</div>
            <div className="TableColumn-recharge w-[250px]">Date & Time</div>
           
            <div className="TableColumn-recharge px-[15px]">Solve</div>
        </div>
                {
    Object.values(complaints).map((val,index)=>{
        return(
        <div key={val._id} className="TableRow w-[100%]">
            <div className="TableColumn-recharge w-[40px]">{((currePageNo - 1)*perPageDoc) + (index+1)}</div>
            <div className="TableColumn-recharge w-[100px]">{val.contact}</div>
            <div className="TableColumn-recharge w-[200px]">{val.type}</div>
            <div className="TableColumn-recharge w-[400px]">{val.desc}</div>
            <div className="TableColumn-recharge w-[250px]">{ (new Date(val.time).getDate())<10 ?`0${(new Date(val.time).getDate())}` :(new Date(val.time).getDate()) }-{(new Date(val.time).getMonth() + 1)<10 ?`0${(new Date(val.time).getMonth() + 1)}` :(new Date(val.time).getMonth() + 1) }-{new Date(val.time).getFullYear()} {new Date(val.time).toLocaleTimeString()}</div>
            <div className="TableColumn-recharge px-[15px]"><button id={val._id} className="edit-enable" onClick={()=>OpenRuleModal(val._id,val.type,val.desc)} >Solve</button></div> 
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
    </>
  )
}

export default Complaints
import React,{useEffect,useState} from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router';
import AuthAdmin from './AuthAdmin';
import SideBar from './SideBar';

const SessionEmerd = () => {

    const [search,setSearch] = useState('');
    const [num,setNum] = useState('');
    const navigate = useNavigate();


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
    
    const hanldeSearch = ()=>{

    }

    function addMinutes(date, minutes) {
        const dateCopy = new Date(date);
        dateCopy.setMinutes(date.getMinutes() + minutes);
        return dateCopy;
      }

      const getPeriod = () => {
        const date = new Date();
        let diff = (new Date()).getTimezoneOffset();
        let sum = 330 + diff;
        const newDate = addMinutes(date, sum);
        const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        const days = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
        let y = newDate.getFullYear();
        let m = months[newDate.getMonth()];
        let d = days[newDate.getDate()];
        const min = ((newDate.getHours()) * 60) + (newDate.getMinutes());
        let minBythree = Math.floor(min / 3) + 1;
        if (minBythree.toString().length === 1) {
          minBythree = `00${minBythree}`;
        } else if (minBythree.toString().length === 2) {
          minBythree = `0${minBythree}`
        }
        return `${y}${m}${d}${minBythree}`;
      }
    
      const getMinutes = () => {
        const date = new Date();
        let diff = (new Date()).getTimezoneOffset();
        let sum = 330 + diff;
        const newDate = addMinutes(date, sum);
        return newDate.getMinutes();
      }
      
      const getSec = () => {
        const date = new Date();
        let diff = (new Date()).getTimezoneOffset();
        let sum = 330 + diff;
        const newDate = addMinutes(date, sum);
        return newDate.getSeconds();
      }

      let x,sec,min;

      setInterval(() => {
        let periodDiv = document.getElementById('period');
        let counter = document.getElementById('countDown');
    
        if(periodDiv !== null){
          sec = getSec();
          min = Math.abs(getMinutes()%3 - 2);
    
    
          if((59 - sec).toString().length === 1){
            counter.innerHTML = `0${min} : 0${59 - sec}`;
          }else{
            counter.innerHTML = `0${min} : ${59 - sec}`;
          }
    
          x = getPeriod();
          periodDiv.innerHTML = x;
        }
      }, 1000);

    const hanldeSelect = (e)=>{
    let number = parseInt(e.target.value);
    setNum(number);
    }


    const submitPeriod = ()=>{
     let remainMin = Math.abs(getMinutes()%3 - 2);
     let remainSec = 59 - getSec();

     if(num === ''){
      showToast('Please select server and number ');
    }else{
      if(remainMin === 0){
        if(remainSec <=30){
 

        }else{
         showToast('Please wait ...');
        }
      }else{
        showToast('Please wait ...');
      }
    }
     
    }
    useEffect(()=>{
        AuthAdmin().then((finalData)=>{
            if(finalData.message !== 'success'){
              navigate('/');
            }
          });
        },[]);
  return (
    <>
        <SideBar cl5="uil uil-chart-line active-menu" clFive="active-menu" />
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
                    <span className="text">All Session</span>
                </div>
        </div>
        <div className="flex flex-row justify-around">
        <NavLink to="/sessions/parity"><div><button className="server-btn">Parity</button></div></NavLink>
        <NavLink to="/sessions/sapre"><div><button className="server-btn">Sapre</button></div></NavLink>
        <NavLink to="/sessions/bcone"><div><button className="server-btn">Bcone</button></div></NavLink>
        <NavLink to="/sessions/emerd"><div><button className="server-btn active-server">Emerd</button></div></NavLink>
          </div>
        <h1 className="text-[24px]">Manage Winning Result</h1>

        <div className="flex flex-row justify-between">
            <div className="flex flex-col">
                <div>Count Down:</div>
                <div id="countDown" ></div>
            </div>
            <div className="flex flex-col">
                <div>Active Period Id</div>
                <div id="period"></div>
            </div>
            <div className="flex flex-col">
              <div>Do you want manual result ?</div>
              <div className="flex flex-row justify-around">
                <div>Yes <input className="cursor-pointer" type="radio" name="resulttype" value="yes" /></div>
                <div>No <input className="cursor-pointer" type="radio" name="resulttype" value="no" /></div>
              </div>
            </div>
        </div>

        <div className="TableRow heading justify-between mt-20">
            <div className="TableColumn">Result</div>
            <div className="TableColumn">Number</div>
            <div className="TableColumn">No. of bets</div>
            <div className="TableColumn">Amounts</div>
            <div className="TableColumn">Action</div>
        </div>

        <div className="TableRow justify-between mt-20">
            <div className="TableColumn"><span className="color-red">Red &nbsp; </span> + <span className="color-violet"> &nbsp; Violet</span></div>
            <div className="TableColumn">0</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="0" /></div>
        </div>
        
        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-green">Green</span></div>
            <div className="TableColumn">1</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="1" /></div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-red">Red</span></div>
            <div className="TableColumn">2</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="2" /></div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-green">Green</span></div>
            <div className="TableColumn">3</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="3" /></div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-red">Red</span></div>
            <div className="TableColumn">4</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="4" /></div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-green">Green &nbsp; </span> + <span className="color-violet"> &nbsp; Violet</span></div>
            <div className="TableColumn">5</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="5" /></div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-red">Red</span></div>
            <div className="TableColumn">6</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="6" /></div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-green">Green</span></div>
            <div className="TableColumn">7</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="7" /></div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-red">Red</span></div>
            <div className="TableColumn">8</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="8" /></div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-green">Green</span></div>
            <div className="TableColumn">9</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="9" /></div>
        </div>

        <button onClick={submitPeriod} className="submit-period">Submit</button>



        </div>
    </section>
    </>
  )
}

export default SessionEmerd;
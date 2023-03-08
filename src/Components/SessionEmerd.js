import React,{useEffect,useState} from 'react';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import AuthAdmin from './AuthAdmin';
import SideBar from './SideBar';

const SessionEmerd = () => {

    const [profitLoss,setProfitLoss] = useState(['-','-','-','-','-','-','-','-','-','-']);
    const [num,setNum] = useState('');
    const [betMoney,setBetMoney] = useState(['Wait..','Wait..','Wait..','Wait..','Wait..','Wait..','Wait..','Wait..','Wait..','Wait..','Wait..','Wait..','Wait..']);
    const [isNum,setIsNum] = useState(false);
    const [completedTarget,setCompletedTarget] = useState('');
    const [currentTarget,setCurrentTarget] = useState('');
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

    const hanldeSelect = (e)=>{
    let number = parseInt(e.target.value);
    setNum(number);

      if(isNum){
       // do task here only
      }else{
        showToast('Please wait');
      }

    }

    const setTarget  = ()=>{
     let targetAmount = prompt('Please enter amount');
     if(parseInt(targetAmount) >0){
      fetch('/api/setactivetarget',{
        method:'post',
        body:JSON.stringify({server:'emerd',target:targetAmount}),
        headers:{
          'Content-Type':'application/json',
          'authorization':`Bearer ${token}`
        }
      }).then((data)=>data.json()).then((finalData)=>{

         if(finalData.message === 'success'){
          fetch('/api/getalltargets',{
            method:'post',
            body:JSON.stringify({server:'emerd'}),
            headers:{
              'Content-Type':'application/json',
              'authorization':`Bearer ${token}`
            }
          }).then((data)=>data.json()).then((finalData)=>{
            setCurrentTarget(finalData.curretTarget);
            setCompletedTarget(finalData.completedTargets);
            
          });
       }
      });
     }else{
       showToast('Please enter valid amount');
     }
    }


    const submitPeriod = ()=>{
     let remainMin = Math.abs(getMinutes()%3 - 2);
     let remainSec = 59 - getSec();
     console.log(num);

     if(num === ''){
      showToast('Please select number ');
    }else{
      if(remainMin === 0){
        if(remainSec <=30 && remainSec>5){
          fetch('/api/updatebet',{
          method:'post',
          body:JSON.stringify({server:'emerd',number:num}),
          headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
      }
      }).then((data)=>data.json()).then((finalData)=>{
        console.log(finalData);
        if(finalData.message === 'success'){
          
          fetch('/api/getalltargets',{
          method:'post',
          body:JSON.stringify({server:'emerd'}),
          headers:{
          'Content-Type':'application/json',
          'authorization':`Bearer ${token}`
          }
         }).then((data)=>data.json()).then((finalData)=>{
         setCurrentTarget(finalData.curretTarget);
         setCompletedTarget(finalData.completedTargets);
        });

          showToast('Submitted successfully');
        }else{
          showToast('Some error occurred');
        }
      });

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

      fetch('/api/getalltargets',{
        method:'post',
        body:JSON.stringify({server:'emerd'}),
        headers:{
          'Content-Type':'application/json',
          'authorization':`Bearer ${token}`
        }
      }).then((data)=>data.json()).then((finalData)=>{
        setCurrentTarget(finalData.curretTarget);
        setCompletedTarget(finalData.completedTargets);
        console.log(finalData);
      });


        let x;
        let min = Math.abs(getMinutes()%3 - 2);
        let sec = getSec();

        if(min === 0 && sec >30){
          fetch('/api/getbetdata',{
            method:'post',
            body:JSON.stringify({server:'emerd'}),
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
              }
            }).then((data)=>data.json()).then((finalData)=>{
              if(finalData.count === 0){
                let getDataInter = setInterval(()=>{
                 fetch('/api/getbetdata',{
                 method:'post',
                 body:JSON.stringify({server:'emerd'}),
                 headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                   }
                 }).then((data)=>data.json()).then((finalData)=>{
                   if(finalData.count !== 0){
                    setBetMoney(finalData.result[0].BetMoney);
                    setIsNum(true);
                    let arrProfitLoss = [0,1,2,3,4,5,6,7,8,9];
                    let totalBetAmount = finalData.result[0].BetMoney.reduce((partialSum, a) => partialSum + a, 0);
                    arrProfitLoss.forEach((ele,index)=>{
                      if(index === 1 || index === 3 || index === 7 || index === 9){
                        arrProfitLoss[index] = totalBetAmount - ((finalData.result[0].BetMoney[index]*10) + (finalData.result[0].BetMoney[10]*2));
                      }else if(index === 2 || index === 4 || index === 6 || index === 8){
                        arrProfitLoss[index] = totalBetAmount - ((finalData.result[0].BetMoney[index]*10) + (finalData.result[0].BetMoney[12]*2));
                      }else if(index === 0){
                        arrProfitLoss[index] = totalBetAmount - ((finalData.result[0].BetMoney[index]*10) + (finalData.result[0].BetMoney[11]*4.5) + (finalData.result[0].BetMoney[12]*1.5));
                      }else{
                        arrProfitLoss[index] = totalBetAmount - ((finalData.result[0].BetMoney[index]*10) + (finalData.result[0].BetMoney[11]*4.5) + (finalData.result[0].BetMoney[10]*1.5));
                      }
                    });
                    setProfitLoss(arrProfitLoss);
                    console.log(arrProfitLoss);
                    clearInterval(getDataInter);
                   }
                 });
                },1000);
               }else{
                let arrProfitLoss = [0,1,2,3,4,5,6,7,8,9];
                let totalBetAmount = finalData.result[0].BetMoney.reduce((partialSum, a) => partialSum + a, 0);
                arrProfitLoss.forEach((ele,index)=>{
                  if(index === 1 || index === 3 || index === 7 || index === 9){
                    arrProfitLoss[index] = totalBetAmount - ((finalData.result[0].BetMoney[index]*10) + (finalData.result[0].BetMoney[10]*2));
                  }else if(index === 2 || index === 4 || index === 6 || index === 8){
                    arrProfitLoss[index] = totalBetAmount - ((finalData.result[0].BetMoney[index]*10) + (finalData.result[0].BetMoney[12]*2));
                  }else if(index === 0){
                    arrProfitLoss[index] = totalBetAmount - ((finalData.result[0].BetMoney[index]*10) + (finalData.result[0].BetMoney[11]*4.5) + (finalData.result[0].BetMoney[12]*1.5));
                  }else{
                    arrProfitLoss[index] = totalBetAmount - ((finalData.result[0].BetMoney[index]*10) + (finalData.result[0].BetMoney[11]*4.5) + (finalData.result[0].BetMoney[10]*1.5));
                  }
                });
                setProfitLoss(arrProfitLoss);
                console.log(arrProfitLoss);
                setBetMoney(finalData.result[0].BetMoney);
               }
            });
        }

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

            if(min === 0 && sec === 30){
              fetch('/api/getbetdata',{
                method:'post',
                body:JSON.stringify({server:'emerd'}),
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                  }
                }).then((data)=>data.json()).then((finalData)=>{
                  if(finalData.count === 0){
                    let getDataInterval = setInterval(()=>{
                     fetch('/api/getbetdata',{
                     method:'post',
                     body:JSON.stringify({server:'emerd'}),
                     headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${token}`
                       }
                     }).then((data)=>data.json()).then((finalData)=>{
                       if(finalData.count !== 0){
                        setBetMoney(finalData.result[0].BetMoney);
                        setIsNum(true);
                        let arrProfitLoss = [0,1,2,3,4,5,6,7,8,9];
                        let totalBetAmount = finalData.result[0].BetMoney.reduce((partialSum, a) => partialSum + a, 0);
                        arrProfitLoss.forEach((ele,index)=>{
                          if(index === 1 || index === 3 || index === 7 || index === 9){
                            arrProfitLoss[index] = totalBetAmount - ((finalData.result[0].BetMoney[index]*10) + (finalData.result[0].BetMoney[10]*2));
                          }else if(index === 2 || index === 4 || index === 6 || index === 8){
                            arrProfitLoss[index] = totalBetAmount - ((finalData.result[0].BetMoney[index]*10) + (finalData.result[0].BetMoney[12]*2));
                          }else if(index === 0){
                            arrProfitLoss[index] = totalBetAmount - ((finalData.result[0].BetMoney[index]*10) + (finalData.result[0].BetMoney[11]*4.5) + (finalData.result[0].BetMoney[12]*1.5));
                          }else{
                            arrProfitLoss[index] = totalBetAmount - ((finalData.result[0].BetMoney[index]*10) + (finalData.result[0].BetMoney[11]*4.5) + (finalData.result[0].BetMoney[10]*1.5));
                          }
                        });
                        setProfitLoss(arrProfitLoss);
                        console.log(arrProfitLoss);
                        clearInterval(getDataInterval);
                       }
                     });
                    },1000);
                   }else{
                    setBetMoney(finalData.result[0].BetMoney);
                   }
                });
            }

            x = getPeriod();
            periodDiv.innerHTML = x;
          }

          if(min === 0 && sec === 59){
            setBetMoney(['Wait..','Wait..','Wait..','Wait..','Wait..','Wait..','Wait..','Wait..','Wait..','Wait..','Wait..','Wait..','Wait..']);
            setProfitLoss(['-','-','-','-','-','-','-','-','-','-']);
            setIsNum(false);
          }
        }, 1000);

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
                <input type="text" name="search" placeholder="Search here"  autoComplete="off"/>
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
            <div className="TableColumn">Profit/Loss</div>
        </div>

        <div className="TableRow justify-between mt-20">
            <div className="TableColumn"><span className="color-red">Red &nbsp; </span> + <span className="color-violet"> &nbsp; Violet</span></div>
            <div className="TableColumn">0</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">{betMoney[0]}</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="0" /></div>
            <div className="TableColumn">{profitLoss[0]}</div>
        </div>
        
        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-green">Green</span></div>
            <div className="TableColumn">1</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">{betMoney[1]}</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="1" /></div>
            <div className="TableColumn">{profitLoss[1]}</div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-red">Red</span></div>
            <div className="TableColumn">2</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">{betMoney[2]}</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="2" /></div>
            <div className="TableColumn">{profitLoss[2]}</div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-green">Green</span></div>
            <div className="TableColumn">3</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">{betMoney[3]}</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="3" /></div>
            <div className="TableColumn">{profitLoss[3]}</div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-red">Red</span></div>
            <div className="TableColumn">4</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">{betMoney[4]}</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="4" /></div>
            <div className="TableColumn">{profitLoss[4]}</div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-green">Green &nbsp; </span> + <span className="color-violet"> &nbsp; Violet</span></div>
            <div className="TableColumn">5</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">{betMoney[5]}</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="5" /></div>
            <div className="TableColumn">{profitLoss[5]}</div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-red">Red</span></div>
            <div className="TableColumn">6</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">{betMoney[6]}</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="6" /></div>
            <div className="TableColumn">{profitLoss[6]}</div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-green">Green</span></div>
            <div className="TableColumn">7</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">{betMoney[7]}</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="7" /></div>
            <div className="TableColumn">{profitLoss[7]}</div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-red">Red</span></div>
            <div className="TableColumn">8</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">{betMoney[8]}</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="8" /></div>
            <div className="TableColumn">{profitLoss[8]}</div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-green">Green</span></div>
            <div className="TableColumn">9</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">{betMoney[9]}</div>
            <div className="TableColumn"><input type="radio" onChange={hanldeSelect} name="select-number" value="9" /></div>
            <div className="TableColumn">{profitLoss[9]}</div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-red">Red</span></div>
            <div className="TableColumn">Red</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">{betMoney[12]}</div>
            <div className="TableColumn">Can't select</div>
            <div className="TableColumn"></div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-red">Green</span></div>
            <div className="TableColumn">Green</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">{betMoney[10]}</div>
            <div className="TableColumn">Can't select</div>
            <div className="TableColumn"></div>
        </div>

        <div className="TableRow justify-between">
            <div className="TableColumn"><span className="color-violet">Violet</span></div>
            <div className="TableColumn">Violet</div>
            <div className="TableColumn">Wait..</div>
            <div className="TableColumn">{betMoney[11]}</div>
            <div className="TableColumn">Can't select</div>
            <div className="TableColumn"></div>
        </div>

        <button onClick={submitPeriod} className="submit-period">Submit</button>
       <h3 className="mt-[10px] text-[#0066ff] text-[18px]">All Targets</h3>
      <div className="flex flex-col mt-[10px]">
      <h2 className='text-[18px] mb-[5px]'>Set Active target :</h2>
      <button className="bg-blue-800 w-[80px] text-center text-white p-[10px] rounded-[5px] text-[18px] mb-[10px]" onClick={setTarget}>Set</button>
      </div>

      <div className="flex flex-col mt-[20px]">
      <h2 className='text-[18px] mb-[10px]'>Active target :</h2>
      
      <div className='flex flex-row gap-[20px]'>
        <div>Target : {currentTarget.Target}</div>
        <div>Profit/Loss : {currentTarget.ProfitOrLoss}</div>
      </div>

      </div>
      <div className="flex flex-col mt-[20px]">
      <h2 className='text-[18px] mb-[10px]'>Completed target :</h2>
     {Object.values(completedTarget).map((val,index)=>{
      return(
      <div className='flex flex-row gap-[20px]' key={val._id}>
        <div>Period : {val.Period}</div>
        <div>Target : {val.Target}</div>
        <div>Profit/Loss : {val.ProfitOrLoss}</div>
      </div>
      );
     })}
      </div>
        </div>
    </section>
    </>
  )
}

export default SessionEmerd;
import Hosturl from '../Hosturl';

const MakePrediction  = async (server,period,color,firstPeriod,isFirst = false)=>{
    const token = localStorage.getItem('token');
    let allData = await fetch(`${Hosturl}/api/makeprediction`,{
          method:'post',
          body:JSON.stringify({server:server,period:period,isFirst:isFirst,color:color,firstPeriod:firstPeriod}),
          headers:{
            'Content-Type':'application/json',
            'authorization':`Bearer ${token}`
          }
        });
    allData = await allData.json();
    return allData;
}

export default MakePrediction;
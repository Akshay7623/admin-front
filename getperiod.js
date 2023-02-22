function addMinutes(date, minutes) {
    const dateCopy = new Date(date);
    dateCopy.setMinutes(date.getMinutes() + minutes);
    return dateCopy;
  }

  const get100AgoPeriod = () => {
    let num =  18180000;
    let x = parseInt(new Date().getTime()) - num;
    const date = new Date(x);
    let diff = (new Date(x)).getTimezoneOffset();
    let sum = 330 + diff;
    const newDate = addMinutes(date, sum);
    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const days = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
    let y = newDate.getFullYear(x);
    let m = months[newDate.getMonth(x)];
    let d = days[newDate.getDate(x)];
    const min = ((newDate.getHours(x)) * 60) + (newDate.getMinutes(x));
    let minBythree = Math.floor(min / 3) + 1;
    if (minBythree.toString().length === 1) {
      minBythree = `00${minBythree}`;
    } else if (minBythree.toString().length === 2) {
      minBythree = `0${minBythree}`
    }
    return `${y}${m}${d}${minBythree}`;
  }

  let period100 = get100AgoPeriod();

console.log(period100)

sapreResults.deleteMany({Period:period100});
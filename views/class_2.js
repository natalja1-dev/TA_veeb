const firstName = "Natalja";
const lastName = "Jakobson";
let oneRandomNumber = 0;

console.log(firstName + " " + lastName);
function tellAuthorsName(){
	console.log("Programmi autor on " + firstName + " " + lastName);
}

function generateNumberValue(){ 
	let newNumber = Math.round(Math.random()*10);
	//oneRandomNumber = newNumber;
	return newNumber;
}

function dateNowFormattedET(){
	let timeNow = new Date();
	//let dateNow = timeNow.getDate();
	//let monthNow = timeNow.getMonth();
	//let yearNow = timeNow.getYear();
	//let yearNow = timeNow.getFullYear();
    //let dayNow = timeNow.getDay();
	const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	//return dateNow + "." + (monthNow + 1) + "." + yearNow;
    const dayNamesET = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"]
	return timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear() + ", " + dayNamesET[timeNow.getDay()]
}

function timeNowFormattedET(){
	let timeNow = new Date();
	//let hourNow = timeNow.getHours();
	// let minuteNow = timeNow.getMinutes();
	// let secondNow = timeNow.getSeconds();
	return timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds()
}

tellAuthorsName();
oneRandomNumber = generateNumberValue();
console.log("Genereerisin juhusliku arvu " + oneRandomNumber);	
//console.log(new Date());
console.log("Täna on " + dateNowFormattedET());
console.log("Kell on " + timeNowFormattedET());


const dateNowFormattedET = function (){
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

const timeNowFormattedET = function (){
	let timeNow = new Date();
	//let hourNow = timeNow.getHours();
	// let minuteNow = timeNow.getMinutes();
	// let secondNow = timeNow.getSeconds();
	return timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds()
}

const partOfDay  = function(){
	let dayPart = "suvaline aeg";
	let hourNow = new Date().getHours();
	if(hourNow <= 6) {
		dayPart = "varahommik";
	} else if(hourNow < 12) {
		dayPart = "hommik";
	} else if(hourNow == 12) {
		dayPart = "keskpäev"
	}
	return dayPart;
}

//ekspordin kõik vajaliku
module.exports = {fullDate: dateNowFormattedET, fullTime: timeNowFormattedET, partOfDay: partOfDay };
const express = require("express");
const fs = require("fs");
//päringu lahtiharutaja POST jaoks
const bodyparser = require("body-parser");
//SQL andmebaasi moodul
const mysql = require("mysql2");
const dateEt = require("./src/dateTimeET");
const dbInfo = require("./vp2025config");
const textRef = "public/txt/vanasonad.txt";
//käivitan express.js funktsiooni ja annan talle nimeks "app"
const app = express();
//määran veebilehtede mallide renderdamise mootori
app.set("view engine", "ejs");
//määran ühe päris kataloogi avalikult kättesaadavaks
app.use(express.static("public"));
//parsime päringu URL-i, lipp false, kui ainult tekst ja true, kui muid andmeid ka
app.use(bodyparser.urlencoded({extended: false}));

console.log(dbInfo.configData.host);

//loon andmebaasiühenduse
const conn = mysql.createConnection({
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_natalja_j"
});

app.get("/", (req, res)=>{
	//res.send("Express.js läks käima ja serveerib veebi!");
	res.render("index");
});

app.get("/timenow", (req, res)=>{
	const weekDayNow = dateEt.weekDay();
	const dateNow = dateEt.fullDate();
	res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow});
});

app.get("/vanasonad", (req, res)=>{
	let folkWisdom = [];
	fs.readFile(textRef, "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka väljastame veebilehe, liuhtsalt vanasõnu pole ühtegi
			res.render("genericlist", {heading: "Valik Eesti vanasõnu", listData: ["Ei leidnud ühtegi vanasõna!"]});
		}
		else {
			folkWisdom = data.split(";");
			res.render("genericlist", {heading: "Valik Eesti vanasõnu", listData: folkWisdom});
		}
	});
});

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateEt.fullDate() + " kell " + dateEt.fullTime() + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("visitregistered", {visitor: req.body.firstNameInput + " " + req.body.lastNameInput});
				}
			});
		}
	});
});

app.get("/visitlog", (req, res)=>{
	let listData = [];
	fs.readFile("public/txt/visitlog.txt", "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka väljastame veebilehe, liuhtsalt vanasõnu pole ühtegi
			res.render("genericlist", {heading: "Registreeritud külastused", listData: ["Ei leidnud ühtegi külastust!"]});
		}
		else {
			listData = data.split(";");
			let correctListData = [];
			for(let i = 0; i < listData.length - 1; i ++){
				correctListData.push(listData[i]);
			}
			res.render("genericlist", {heading: "registreeritud külastused", listData: correctListData});
		}
	});
});

app.get("/Eestifilm", (req, res)=>{
	res.render("eestifilm");
});

app.get("/Eestifilm/inimesed", (req, res)=>{
	const sqlReq = "SELECT * FROM person";
	conn.execute(sqlReq, (err, sqlres)=>{
		if(err){
			throw(err);
		}
		else {
			console.log(sqlres);
			res.render("filmiinimesed", {personList: sqlres});
		}
	});
	//res.render("filmiinimesed");
});

app.get("/Eestifilm/filmiinimesed_add", (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
});

app.post("/Eestifilm/filmiinimesed_add", (req, res)=>{
	console.log(req.body);
	//kas andmed on olemas
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date()){
	  res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});
	}
	else {
		let deceasedDate = null;
		if(req.body.deceasedInput != ""){
			deceasedDate = req.body.deceasedInput;
		}
		let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
		conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate], (err, sqlres)=>{
			if(err){
				res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus"});
			}
			else {
				res.render("filmiinimesed_add", {notice: "Andmed salvestatud"});
			}
		});
		
	}
});

app.get("/Eestifilm/ametid", (req, res)=>{
	const sqlReq = "SELECT * FROM position";
	conn.execute(sqlReq, (err, sqlres)=>{
		if(err){
			throw(err);
		}
		else {
			console.log(sqlres);
			res.render("ametid", {positionList: sqlres});
		}
	});
	//res.render("ametid");
});

app.get("/Eestifilm/ametid_add", (req, res)=>{
	res.render("ametid_add", {notice: "Ootan sisestust"});
});

app.post("/Eestifilm/ametid_add", (req, res)=>{
	console.log(req.body);
	//kas andmed on olemas
	if(!req.body.positionNameInput || !req.body.positionDescriptionInput){
	  res.render("ametid_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});
	}
	else {
		let positionDescription = null;
		if(req.body.positionDescriptionInput != ""){
			positionDescription = req.body.positionDescriptionInput;
		}
		let sqlReq = "INSERT INTO `position` (position_name, description) VALUES (?,?)";
		conn.execute(sqlReq, [req.body.positionNameInput, positionDescription], (err, sqlres)=>{
            console.log(sqlReq);
            console.log(req.body.positionNameInput);
            console.log(req.body.positionDescriptionInput);
			if(err){
                console.error("SQL Error Message:", err.sqlMessage); // descriptive message from MariaDB
                console.error("SQL Error Code:", err.code);           // code like ER_BAD_FIELD_ERROR
                console.error("SQL Errno:", err.errno);              // numeric code
                console.error("SQL State:", err.sqlState);           // SQLSTATE
				res.render("ametid_add", {notice: "Andmete salvestamine ebaõnnestus"});
			}
			else {
				res.render("ametid_add", {notice: "Andmed salvestatud"});
			}
		});

	}
});


app.listen(5125);
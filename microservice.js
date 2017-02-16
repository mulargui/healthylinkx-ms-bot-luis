//var API_URL_PREFIX = "http://192.168.1.103/"; //android phones doesn't like localhost
//var API_URL_PREFIX = "http://127.0.0.1/";
var API_URL_PREFIX = 'NODEJSAPI'; //linking to the microservice container
var methodseparator="?"

//var API_URL_PREFIX = "http://127.0.0.1/api.php?rquest=";
//var methodseparator="&"

var portnumber = 8081;
var paramseparator="&"

/////////// exporting the entry point to the search code
exports.getSearchResults=getSearchResults;
//////////

var Promise = require('promise');

function getSearchResults(zipcode, lastname, distance, gender, specialty) {
	var requeststring = "/providers";
	var firstparam = true;

	if (zipcode){
		if(firstparam){
			requeststring+=methodseparator;
			firstparam=false;
		}else{
			requeststring+=paramseparator;
		}
		requeststring+="zipcode=";
		requeststring+=zipcode;
	}
	
	if ((gender[0]=='M')||(gender[0]=='F')){
		if(firstparam){
			requeststring+=methodseparator;
			firstparam=false;
		}else{
			requeststring+=paramseparator;
		}
		requeststring+="gender=";
		requeststring+=gender[0];
	}

	if (lastname){
		if(firstparam){
			requeststring+=methodseparator;
			firstparam=false;
		}else{
			requeststring+=paramseparator;
		}
		requeststring+="lastname1=";
		requeststring+=lastname;
	}

	if (specialty){
		if(firstparam){
			requeststring+=methodseparator;
			firstparam=false;
		}else{
			requeststring+=paramseparator;
		}
		requeststring+="specialty=";
		requeststring+=specialty;
	}

	if (distance){
		if(firstparam){
			requeststring+=methodseparator;
			firstparam=false;
		}else{
			requeststring+=paramseparator;
		}
		requeststring+="distance=";
		requeststring+=distance;
	}
	
 	//lets get a few doctors
	return getContent(requeststring).then(format);
	//.then (console.log);
}

function format(responsestring) {
	//translate json from string to array
	var responsejson = JSON.parse(responsestring);
	var length=responsejson.length;

	// no data
	if (length == 0)
		return ('Sorry! We couldn\'t find any doctor. Try a different question');
	
	var result='Doctor\tAddress\tCity\n';
	//format the data 
	for (var i=0; i<length;i++){
 		//result += responsejson[i].NPI +'\t';
 		result += responsejson[i].Provider_Full_Name +'\t';
 		result += responsejson[i].Provider_Full_Street +'\t';
 		result += responsejson[i].Provider_Full_City +'\n';
	}
	return result;
}

function getContent(requeststring) {

	var options = {
  		host: API_URL_PREFIX,
		port: portnumber,
  		path: requeststring
 	};

	var responsestring="";

	return new Promise (function(resolve,reject){
		var req = require("http").request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				responsestring += chunk;
			});

			res.on('error', function(e) {
				return reject(e);
			});	

			res.on('end', function() {
				//no data
				if (!responsestring) {	
					return resolve('');
				}
				return resolve(responsestring);
			});
		}).end();
	})	
}

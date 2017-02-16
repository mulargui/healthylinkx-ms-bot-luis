
var builder = require('botbuilder');
var microservice = require("./microservice"); 

exports.conversation = [
	function (session) {
		builder.Prompts.text(session, 'Looking for a doctor? (yes/no)');
	},
	function (session, results) {
		if(results.response == 'no')
			return session.send('Perhaps later. Good bye!');
		
		builder.Prompts.text(session, 'Great!\nWe only cover Washington State.\nWhat are you looking for (or no to finish)?');	 
	},
	function (session, results) {
		if(results.response == 'no')
			return session.send('Perhaps later. Good bye!');
		
		//ask LUIS for the question
		getQuestion(results.response)
			.then(function(res) {
				
				//translate json from string to array
				var resjson = JSON.parse(res);
				var length=resjson.length;

				// no data
				if (length == 0)
					return session.send('Sorry! We couldn\'t find any doctor. Try a different question');
				
				var zipcode='', lastname='', distance='', gender='', specialty='';
				resjson.entities.forEach(function(element){
					if(element.type=='lastname')
						lastname = element.entity;
					if(element.type=='gender')
						gender = element.entity;
					if(element.type=='zipcode')
						zipcode = element.entity;
					if(element.type=='specialty')
						specialty = element.entity;
					if(element.type=='dimension')
						distance = element.entity;
				});
				
				/*session.send('Ok! This is what we know');
				session.send('Zipcode: '    + zipcode);
				session.send('Distance: '   + distance);
				session.send('Gender: '     + gender);
				session.send('Lastname: '   + lastname);
				session.send('Speciality: ' + specialty);*/
		
				microservice.getSearchResults(zipcode, lastname, distance, 
					gender, specialty)
					.then( function(res) {
						session.send(res);
					});
			});
	}
];

var constants = require("./constants.js");

function getQuestion(requeststring) {
	//LUIS service parameters
	//var LUIS_URL = "Secret URL defined in contants.js and not uploaded to github"; 
	//var LUIS_KEYS = "Secret KEYS defined in contants.js and not uploaded to github"; 
	
	var options = {
  		host: constants.LUIS_URL,
  		path: constants.LUIS_KEYS + "&q=" + requeststring.replace(/ /g, '%20')
 	};

	var responsestring="";

	return new Promise (function(resolve,reject){
		var req = require("https").request(options, function(res) {
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

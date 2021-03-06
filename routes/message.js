var express = require('express'),
    router = express.Router();

var validate=require('../lib/validate.js');
var config=require('../config/config.js');
var admodel = require('../models/adsmodel');
var common = require('../lib/common');
var q= require('q');
const {ObjectId} = require('mongodb'); // or ObjectID 
var forEach = require('async-foreach').forEach;



  router.post('/send', function (req, res) {
  	common.jwtTokenValidation(q,req).then(function(validateResults){

		if(validateResults.status == 200)
		{
			try
			{

			var jwtDetails = validateResults.details;
			console.log("herere");
		  	var message = {};

		  	var userid = jwtDetails.id;

		  	var inputParams = req.body; 

		  	var adId = inputParams.adid;

		  	var UpdateArray = {
		  		'message':inputParams.message,
		  		'userid':ObjectId(userid),
		  		'created_date':new Date(),
		  		'message_id':ObjectId()
		  	};

		  	admodel.updateMessage(q,UpdateArray,adId).then(function(updateResults){
		  		admodel.message_details(q,adId).then(function(messageResults){
		  				var i =0 ;
		  				messageResults.forEach(function(element) {
		  				messageResults[i].profileImage = common.profileExists(element.user_profile);
		  				i++;
		  				})

				  		message.message = req.__('success');
						message.details = messageResults;
						res.status(200).send(message);
		  		})
		  	})
		  }
		  catch(err)
		  {
		  	console.log(err);
		  }
		}
		else
		{
			res.status(validateResults.status).send(validateResults.message);
		}

	});
  });

  router.post('/reply', function (req, res) {
  	common.jwtTokenValidation(q,req).then(function(validateResults){

		if(validateResults.status == 200)
		{
			try
			{

			var jwtDetails = validateResults.details;
			console.log("herere");
		  	var message = {};

		  	var userid = jwtDetails.id;

		  	var inputParams = req.body; 

		  	var ID = inputParams.id;
		  	var adId = inputParams.adid;

		  	var UpdateArray = {
		  		'message':inputParams.message,
		  		'userid':ObjectId(userid),
		  		'created_date':new Date()
		  	};

		  	admodel.updateReplyMessage(q,UpdateArray,ID).then(function(updateResults){
		  		admodel.message_details(q,adId).then(function(messageResults){
		  				var i =0 ;
		  				messageResults.forEach(function(element) {
		  				messageResults[i].profileImage = common.profileExists(element.user_profile);
		  				i++;
		  				})

				  		message.message = req.__('success');
						message.details = messageResults;
						res.status(200).send(message);
		  		})
		  	})
		  }
		  catch(err)
		  {
		  	console.log(err);
		  }
		}
		else
		{
			res.status(validateResults.status).send(validateResults.message);
		}

	});
  });

   router.post('/list', function (req, res) {
  	common.jwtTokenValidation(q,req).then(function(validateResults){

		if(validateResults.status == 200)
		{

			var jwtDetails = validateResults.details;
			console.log("herere");
		  	var message = {};

		  	var search = req.body; 
		  	console.log(search);

		  	hashtagmodel.hashtagList(q,search).then(function(hashtagResults){
		  		message.message = req.__('success');
				let hashtagArray = [];
				  forEach(hashtagResults, function(element, index) {
      				var done = this.async();
					hashtagArray.push(element.hashtag);
					done();
				})
				message.details = hashtagArray;
				res.status(200).send(message);
		  	})
		}
		else
		{
			res.status(validateResults.status).send(validateResults.message);
		}

	});
  });



module.exports = router;

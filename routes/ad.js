var express = require('express'),
    router = express.Router();

var validate=require('../lib/validate.js');
var config=require('../config/config.js');
var adsmodel = require('../models/adsmodel');
var common = require('../lib/common');
var q= require('q');
const {ObjectId} = require('mongodb'); // or ObjectID 




  router.post('/create', function (req, res) {

  	common.jwtTokenValidation(q,req).then(function(validateResults){

		if(validateResults.status == 200)
		{

			var jwtDetails = validateResults.details;
			console.log("herere");
		  	var message = {};

		  	var inputParams = req.body;

		  	var validate_error  = validate.postad(q,inputParams);


			if(validate_error != undefined)
			{
				if(validate_error)
				{
					var error = validate_error;
					res.status(400).send(error);

				}
				else
				{
					var error= req.__('validation_error');
					res.status(400).send(error);
				}
			}
			else
			{ 
				console.log("finalstep");
				try
				{
				var userid = jwtDetails.id;
				var adImages = inputParams.adImages;
				var adText = inputParams.adtextarea;
				var adImageValues = [];
				//adImages.forEach(function(element) {
				common.multipleImageUpload(q,adImages,userid).then(function(adImageValues){
					common.extractHastags(q,adText).then(function(hashtags){
						console.log('adImageValues',adImageValues);
					try
					{
					var insert_array = {
						'ad_text':adText,
						'created_date':common.currentTimestamp(),
						'user_id':ObjectId(userid),
						'ad_image_1':adImageValues[0],
						'ad_image_2':adImageValues[1],
						'ad_image_3':adImageValues[2],
						'ad_image_4':adImageValues[3],
						'hastags':hashtags
					}
					}
					catch(err)
					{
						console.log(err);
					}
					adsmodel.insert_ads(q,insert_array).then(function(phoneresults){

						message.message = "Ad succesfully posted";
						res.status(200).send(message);

					});
					});
				});
				}
				catch(err)
				{
					console.log(err);
				}
			}

		}
		else
		{
			res.status(validateResults.status).send(validateResults.message);
		}

	});
  });


  router.post('/edit/:id', function (req, res) {

  	common.jwtTokenValidation(q,req).then(function(validateResults){

		if(validateResults.status == 200)
		{

			var jwtDetails = validateResults.details;
			console.log("herere");
		  	var message = {};

		  	var inputParams = req.body;

		  	var adId = req.params.id

		  	var validate_error  = validate.postad(q,inputParams);


			if(validate_error != undefined)
			{
				if(validate_error)
				{
					var error = validate_error;
					res.status(400).send(error);

				}
				else
				{
					var error= req.__('validation_error');
					res.status(400).send(error);
				}
			}
			else
			{ 
				console.log("finalstep");
				try
				{
				var userid = jwtDetails.id;
				var adImages = inputParams.adImages;
				var adText = inputParams.adtextarea;
				var adImageValues = [];
				//adImages.forEach(function(element) {
				common.multipleImageUpload(q,adImages,userid).then(function(adImageValues){
					common.extractHastags(q,adText).then(function(hashtags){
						console.log('adImageValues',adImageValues);
					try
					{
					var insert_array = {
						'ad_text':adText,
						'update_date':common.currentDate(),
						'user_id':ObjectId(userid),
						'ad_image_1':adImageValues[0],
						'ad_image_2':adImageValues[1],
						'ad_image_3':adImageValues[2],
						'ad_image_4':adImageValues[3],
						'hastags':hashtags
					}
					}
					catch(err)
					{
						console.log(err);
					}
					adsmodel.update_ads(q,insert_array,adId).then(function(phoneresults){

						message.message = "Ad succesfully updated";
						res.status(200).send(message);

					});
					});
				});
				}
				catch(err)
				{
					console.log(err);
				}
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

			var userid = jwtDetails.id;

			console.log("herere");
		  	var message = {};

		  	//var inputParams = req.body;

		  	adsmodel.user_ads_list(q,userid).then(function(adresults){
		  				var i =0 ;
		  				adresults.forEach(function(element) {
							adresults[i].ad_image_1 = common.adExists(adresults[i].ad_image_1);
							adresults[i].ad_image_2 = common.adExists(adresults[i].ad_image_2);
							adresults[i].ad_image_3 = common.adExists(adresults[i].ad_image_3);
							adresults[i].ad_image_4 = common.adExists(adresults[i].ad_image_4);
							adresults[i].profileImage = common.profileExists(adresults[i].profileImage);
							i++;
						});
						message.message = req.__('success');
						message.details = adresults;
						res.status(200).send(message);

					});
		}
		else
		{
			res.status(validateResults.status).send(validateResults.message);
		}

	});
	});

	router.post('/detail/:id', function (req, res) {

  	common.jwtTokenValidation(q,req).then(function(validateResults){

		if(validateResults.status == 200)
		{

			var jwtDetails = validateResults.details;

			var userid = jwtDetails.id;

		  	var message = {};

		  	//var inputParams = req.body;

		  	var adId = req.params.id

		  	adsmodel.ad_details(q,adId).then(function(adresults){
		  				var i =0 ;
		  				adresults.forEach(function(element) {
							adresults[i].ad_image_1 = common.adExists(adresults[i].ad_image_1);
							adresults[i].ad_image_2 = common.adExists(adresults[i].ad_image_2);
							adresults[i].ad_image_3 = common.adExists(adresults[i].ad_image_3);
							adresults[i].ad_image_4 = common.adExists(adresults[i].ad_image_4);
							adresults[i].profileImage = common.profileExists(adresults[i].profileImage);
							i++;
						});
						message.message = req.__('success');
						message.details = adresults[0];
						res.status(200).send(message);

					});
		}
		else
		{
			res.status(validateResults.status).send(validateResults.message);
		}

	});
  });

  router.delete('/delete/:id', function (req, res) {

  	common.jwtTokenValidation(q,req).then(function(validateResults){

		if(validateResults.status == 200)
		{

			var jwtDetails = validateResults.details;
			console.log("herere");
		  	var message = {};

		  	var inputParams = req.body;

				var adId = req.params.id
				console.log("finalstep");
				try
				{
				var userid = jwtDetails.id;

				var insert_array = {
					'ad_status':'T'
					}
				}
				catch(err)
				{
				console.log(err);
				}
				adsmodel.update_ads(q,insert_array,adId).then(function(phoneresults){

				message.message = "Ad succesfully updated";
				res.status(200).send(message);

				});
		}
		else
		{
			res.status(validateResults.status).send(validateResults.message);
		}

	});
  });

module.exports = router;
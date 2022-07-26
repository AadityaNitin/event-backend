const express = require('express');

const Event = require("../models/events");
const Guests = require('../models/guests');
const { config } = require('../secrets');

const { authenticate } = require('../middleware/authenticate');
const { csrfCheck } = require('../middleware/csrfCheck');
const { initSession, isEmail } = require('../utils/utils');
const accountSid = "AC6ff283766639883e4211c12be98f74e6";
      const authToken = "b29f3a44da4b039bc9fce7ca4f2115ad";
      const client = require("twilio")(accountSid, authToken);
const router = express.Router();


router.get('/details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const guest = await Guests.findById({ _id: id })

    res.json({
      title: 'Guest Fetched successfully',
      detail: 'guest Fetched',
      guest,
    });
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          title: 'Unauthorized',
          detail: 'Not authorized to access this route',
          errorMessage: err.message,
        },
      ],
    });
  }
});



router.post('/addconsent/:id', async (req, res) => {
  try {

    const {id } = req.params;

    const { consent, consentStatus, consentFilledStatus } = req.body;
    let guest = await Guests.findByIdAndUpdate(id, {$set:{...req.body}}, {new: true})
    console.log({guest})
let event = await Event.findById(guest._doc.eventId)
console.log({event})

    if (req.body.questionnaireStatus) {
      console.log("Inside send questionnaire block")
      console.log({event})

      client.messages
        .create({
          body: `You have been invited to an event. In order to make sure that the health and safety of every attendee is front and center, on-site covid testing will occur at the time of the event. In order to ease the process, we ask that you please fill out this questionnaire prior to your arrival.${config.REACT_APP_URL}/questionnaire/${guest._id}`,
          messagingServiceSid: "MGd9c39d221ef5fab3fcda7e91c02c4c74",
          to: guest.contact,
        })
        .then((message) => console.log(message.sid)).catch((error) => console.log({error}))
        .done();
    }
    // Sending text message to consent form link
    if (req.body.consentStatus) {
      console.log("Inside send consent block")
      client.messages
        .create({
          body: `You have been invited to an event. In order to make sure that the health and safety of every attendee is front and center, on-site covid testing will occur at the time of the event. In order to ease the process, we ask that you please fill out this consent form for testing prior to your arrival.${config.REACT_APP_URL}/consent-form/${guest._id}`,
          messagingServiceSid: "MGd9c39d221ef5fab3fcda7e91c02c4c74",
          to: guest.contact,
        })
        .then((message) => console.log(message.sid)).catch((error) => console.log({error}))
        .done();
    }
    res
      // .cookie('token', session.token, {
      //   httpOnly: true,
      //   sameSite: true,
      //   maxAge: 1209600000,
      //   secure: process.env.NODE_ENV === 'production',
      // })
      .status(201)
      .json({
        title: 'Guest updated successfully',
        detail: 'Guest updated',
        guest,
        // csrfToken: session.csrfToken,
      });
  } catch (err) {
    res.status(400).json({
      errors: [
        {
          title: 'Event creation Error',
          detail: 'Something went wrong during the event creation process.',
          errorMessage: err.message,
        },
      ],
    });
  }
});

router.post('/addquestionnaire/:id', async (req, res) => {
  try {

    const {id } = req.params;

    const { questionnaire, questionnaireStatus, questionnaireFilledStatus } = req.body;
    let guest = await Guests.findByIdAndUpdate(id, {$set:{...req.body}}, {new: true})
    res
      // .cookie('token', session.token, {
      //   httpOnly: true,
      //   sameSite: true,
      //   maxAge: 1209600000,
      //   secure: process.env.NODE_ENV === 'production',
      // })
      .status(201)
      .json({
        title: 'Guest updated successfully',
        detail: 'Guest updated',
        guest,
        // csrfToken: session.csrfToken,
      });
  } catch (err) {
    res.status(400).json({
      errors: [
        {
          title: 'Event creation Error',
          detail: 'Something went wrong during the event creation process.',
          errorMessage: err.message,
        },
      ],
    });
  }
});



router.post('/updatesample/:id', async (req, res) => {
  try {

    const {id } = req.params;

    const { sampleSubmittedStatus } = req.body;
    let guest = await Guests.findByIdAndUpdate(id, {$set:{...req.body}}, {new: true})
   
      let path;
      if(guest.testType === "PCR"){
        path = "pcr-test"

      } else if(guest.testType === "Rapid Antigen"){
        path = "rapid-antigentest";

      }
      console.log({"see this": req.body})
      if(req.body.covidStatus === "Positive" || req.body.covidStatus === "Negative"){ 


      console.log(`${config.REACT_APP_URL}/${path}/${id}`)

        client.messages
        .create({
          body: `Your concierge Covid Test Results are available for review. Please click on the link below to review it ${config.REACT_APP_URL}/${path}/${id}`,
          messagingServiceSid: "MGd9c39d221ef5fab3fcda7e91c02c4c74",
          to: guest.contact,
        })
        .then((message) => console.log(message.sid)).catch((error) => console.log({error}))
        .done();
      } 
      // else if(req.body.covidStatus === false){
      //   client.messages
      //   .create({
      //     body: `${config.REACT_APP_URL}/${path}/${id}`,
      //     messagingServiceSid: "MGd9c39d221ef5fab3fcda7e91c02c4c74",
      //     to: guest.contact,
      //   })
      //   .then((message) => console.log(message.sid)).catch((error) => console.log({error}))
      //   .done();
      // }
      res
      // .cookie('token', session.token, {
      //   httpOnly: true,
      //   sameSite: true,
      //   maxAge: 1209600000,
      //   secure: process.env.NODE_ENV === 'production',
      // })
      .status(201)
      .json({
        title: 'Guest updated successfully',
        detail: 'Guest updated',
        guest,
        // csrfToken: session.csrfToken,
      });
  } catch (err) {
    res.status(400).json({
      errors: [
        {
          title: 'Event creation Error',
          detail: 'Something went wrong during the event creation process.',
          errorMessage: err.message,
        },
      ],
    });
  }
});

router.post('/updatecovidstatus/:id', async (req, res) => {
  try {

    const {id } = req.params;

    const { covidStatus } = req.body;
    let guest = Guests.findByIdAndUpdate(id, {$set:{covidStatus}})
    res
      .cookie('token', session.token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 1209600000,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(201)
      .json({
        title: 'Guest updated successfully',
        detail: 'Guest updated',
        guest,
        csrfToken: session.csrfToken,
      });
  } catch (err) {
    res.status(400).json({
      errors: [
        {
          title: 'Event creation Error',
          detail: 'Something went wrong during the event creation process.',
          errorMessage: err.message,
        },
      ],
    });
  }
});
module.exports = router;

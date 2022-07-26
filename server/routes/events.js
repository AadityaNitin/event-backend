const express = require("express");

const Event = require("../models/events");
const Guest = require("../models/guests");
const { config } = require('../secrets');
const { authenticate } = require("../middleware/authenticate");
const { csrfCheck } = require("../middleware/csrfCheck");
const { initSession, isEmail } = require("../utils/utils");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const {
      userId,
      eventName,
      venue,
      date,
      address,
      attendees,
      contact,
      guests,
    } = req.body;
    if (guests.length <= 0) {
      throw new Error("Please add some guests to this event");
    }
    let guestList = [];
    guests.map(async (singleGuest) => {
      let guest = new Guest({
        name: singleGuest.name,
        email: singleGuest.email,
        contact: singleGuest.contact,
        questionnaireStatus: singleGuest.questionnaireStatus,
        consentStatus: singleGuest.consentStatus,
      });
      console.log(guest._doc._id);
      const accountSid = "AC6ff283766639883e4211c12be98f74e6";
      const authToken = "b29f3a44da4b039bc9fce7ca4f2115ad";
      const client = require("twilio")(accountSid, authToken);

      // Sending text message to questionnaire link

      if (singleGuest.questionnaireStatus) {
        client.messages
          .create({
            body: `You have been invited to an event. In order to make sure that the health and safety of every attendee is front and center, on-site covid testing will occur at the time of the event. In order to ease the process, we ask that you please fill out this questionnaire prior to your arrival.${config.REACT_APP_URL}/questionnaire/${guest._doc._id}`,
            messagingServiceSid: "MGd9c39d221ef5fab3fcda7e91c02c4c74",
            to: singleGuest.contact,
          })
          .then((message) => console.log(message.sid)).catch((error) => console.log({error}))
          .done();
      }
      // Sending text message to consent form link
      if (singleGuest.consentStatus) {
        client.messages
          .create({
            body: `You have been invited to an event. In order to make sure that the health and safety of every attendee is front and center, on-site covid testing will occur at the time of the event. In order to ease the process, we ask that you please fill out this consent form for testing prior to your arrival.${config.REACT_APP_URL}/consent-form/${guest._doc._id}`,
            messagingServiceSid: "MGd9c39d221ef5fab3fcda7e91c02c4c74",
            to: singleGuest.contact,
          })
          .then((message) => console.log(message.sid)).catch((error) => console.log({error}))
          .done();
      }
      guest.save().then((guest) => console.log({ guest: guest }));
      guestList.push(guest._doc._id);
    });

    const event = new Event({
      userId,
      eventName,
      venue,
      date,
      address,
      attendees,
      contact,
      guests: guestList,
    });
    await event.save();

    const session = await initSession(userId);

    res
      .cookie("token", session.token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 1209600000,
        secure: process.env.NODE_ENV === "production",
      })
      .status(201)
      .json({
        title: "Event created successfully",
        detail: "Event added",
        event,
        guestList,
        csrfToken: session.csrfToken,
      });
  } catch (err) {
    res.status(400).json({
      errors: [
        {
          title: "Event creation Error",
          detail: "Something went wrong during the event creation process.",
          errorMessage: err.message,
        },
      ],
    });
  }
});

router.get("/details/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById({ _id: id }).populate("guests");

    res.json({
      title: "Event Fetched successfully",
      detail: "Event Fetched",
      event,
    });
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          title: "Unauthorized",
          detail: "Not authorized to access this route",
          errorMessage: err.message,
        },
      ],
    });
  }
});

router.post("/details/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { eventName, venue, address, attendees, contact, guests } = req.body;

    let guestList = [];
    if (guests.length >= 1) {
      guests.map(async (singleGuest) => {
        let guest = new Guest({
          name: singleGuest.name,
          email: singleGuest.email,
          contact: singleGuest.contact,
          questionnaireStatus: singleGuest.questionnaireStatus,
          consentStatus: singleGuest.consentStatus,
        });
        console.log(guest._doc._id);
        guest.save().then((guest) => console.log({ guest: guest })).catch((error) => console.log({error}));
        guestList.push(guest._doc._id);
            // Sending text message to questionnaire link

      if (singleGuest.questionnaireStatus) {
        client.messages
          .create({
            body: `You have been invited to an event. IN order to make sure that the health and safety of every attendee is front and center, on-site covid testing will occur at the time of the event. In order to ease the process, we ask that you please fill out this questionnaire prior to your arrival.${config.REACT_APP_URL}/questionnaire/${guest._id}`,
            messagingServiceSid: "MGd9c39d221ef5fab3fcda7e91c02c4c74",
            to: singleGuest.contact,
          })
          .then((message) => console.log(message.sid)).catch((error) => console.log({error}))
          .done();
      }
      // Sending text message to consent form link
      if (singleGuest.questionnaireStatus) {
        client.messages
          .create({
            body: `You have been invited to an event. IN order to make sure that the health and safety of every attendee is front and center, on-site covid testing will occur at the time of the event. In order to ease the process, we ask that you please fill out this consent form for testing prior to your arrival.${config.REACT_APP_URL}/consent-form/${guest._id}`,
            messagingServiceSid: "MGd9c39d221ef5fab3fcda7e91c02c4c74",
            to: singleGuest.contact,
          })
          .then((message) => console.log(message.sid)).catch((error) => console.log({error}))
          .done();
      }
      });
    }

    const event = await Event.findByIdAndUpdate(
      { _id: id },
      {
        $push: { guests: guestList },
        $set: { eventName, venue, address, attendees, contact },
      }
    ).populate("guests");

    res.json({
      title: "Event Fetched successfully",
      detail: "Event Fetched",
      event,
    });
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          title: "Unauthorized",
          detail: "Not authorized to access this route",
          errorMessage: err.message,
        },
      ],
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const event = await Event.find();

    res.json({
      title: "Event Fetched successfully",
      detail: "Event Fetched",
      event,
    });
  } catch (err) {
    res.status(401).json({
      errors: [
        {
          title: "Unauthorized",
          detail: "Not authorized to access this route",
          errorMessage: err.message,
        },
      ],
    });
  }
});

module.exports = router;

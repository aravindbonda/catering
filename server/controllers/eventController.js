const Event = require('../models/Event');
const asyncHandler = require('../middleware/asyncHandler');

const createEvent = asyncHandler(async (req, res) => {
  const { eventType, fromLocation, eventLocation, functionHallAddress, eventDate, eventTime, guestCount, notes } = req.body;

  if (!functionHallAddress || !eventDate) {
    res.status(400);
    throw new Error('Function hall address and event date are required');
  }

  const event = await Event.create({
    userId: req.user._id,
    eventType,
    fromLocation,
    eventLocation,
    functionHallAddress,
    eventDate,
    eventTime,
    guestCount,
    notes
  });

  res.status(201).json({ success: true, event });
});

const getMyEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ userId: req.user._id }).sort({ eventDate: -1 });
  res.json({ success: true, events });
});

module.exports = { createEvent, getMyEvents };

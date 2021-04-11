const { Booking, Event } = require('../../models')
const { bookingResponse, eventResponse } = require('./utils')

const bookings = async () => {
    try {
        const result = await Booking.find()
        return result.map(booking => bookingResponse(booking._doc))
    } catch (err) {
        throw err
    }
}

const bookEvent = async (args) => {
    const fetchedEvent = await Event.findById(args.eventId)
    const newBooking = new Booking({
        user: "6071cbf379fade0dc4f2c880",
        event: fetchedEvent
    })
    const createdBooking = await newBooking.save()
    return bookingResponse(createdBooking._doc)
}

const cancelBooking = async (args) => {
    try {
        const booking = await Booking.findById(args.bookingId).populate('event')
        await booking.delete()
        return eventResponse({...booking.event._doc})
    } catch (err) {
        throw err
    }
}

module.exports = { bookings, bookEvent, cancelBooking }

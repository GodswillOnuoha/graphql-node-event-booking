const { Event, User } = require('../../models')
const { dateToString } = require('../../helper/date')

const fetchEvents = async (eventIds) => {
    const result = await Event.find({ _id: { $in: eventIds } })
    return result.map(event => ({...event._doc, date: dateToString(event._doc.date), creator: fetchUser.bind(this, event._doc.creator)}))
}

const fetchEvent = async (eventId) => {
    const result = await Event.findById(eventId)
    return {...result._doc, creator: fetchUser.bind(this, result._doc.creator)}
}

const fetchUser = async (userId) => {
    const result = await User.findById(userId)
    return {...result._doc, createdEvents: fetchEvents.bind(this, result._doc.createdEvents)}
}

const eventResponse = (event) => {
    return {...event, date: dateToString(event.date), creator: fetchUser.bind(this, event.creator)}
}

const bookingResponse = async (booking) => {
    return {
        ...booking,
        user: fetchUser.bind(this, booking.user),
        event: fetchEvent.bind(this, booking.event),
        createdAt: dateToString(booking.createdAt),
        updatedAt: dateToString(booking.updatedAt)
    }
}
module.exports = { eventResponse, bookingResponse }

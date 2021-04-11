const bcrypt = require('bcryptjs')
const { formatDate } = require('../../utils')
const { Booking, Event, User } = require('../../models')

const events = async (eventIds) => {
    const result = await Event.find({ _id: { $in: eventIds } })
    return result.map(event => ({...event._doc, date: formatDate(event._doc.date), creator: user.bind(this, event._doc.creator)}))
}

const fetchEvent = async (eventId) => {
    const result = await Event.findById(eventId)
    return {...result._doc, creator: user.bind(this, result._doc.creator)}
}

const user = async (userId) => {
    const result = await User.findById(userId)
    return {...result._doc, createdEvents: events.bind(this, result._doc.createdEvents)}
}

// Response formats
const eventResponse = (event) => {
    console.log(event)
    return {...event, date: formatDate(event.date), creator: user.bind(this, event.creator)}
}

const bookingResponse = async (booking) => {
    return {
        ...booking,
        user: user.bind(this, booking.user),
        event: fetchEvent.bind(this, booking.event),
        createdAt: formatDate(booking.createdAt),
        updatedAt: formatDate(booking.updatedAt)
    }
}
module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => eventResponse(event._doc))
        } catch {
            throw err
        }
    },
    bookings: async () => {
        try {
            const result = await Booking.find()
            return result.map(booking => bookingResponse(booking._doc))
        } catch (err) {
            throw err
        }
    },
    bookEvent: async (args) => {
        const fetchedEvent = await Event.findById(args.eventId)
        const newBooking = new Booking({
            user: "6071cbf379fade0dc4f2c880",
            event: fetchedEvent
        })
        const createdBooking = await newBooking.save()
        return bookingResponse(createdBooking._doc)
    },
    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event')
            await booking.delete()
            return eventResponse({...booking.event._doc})
        } catch (err) {
            throw err
        }
    },
    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "6071cbf379fade0dc4f2c880"
        })
        try {
            const creator = await User.findById('6071cbf379fade0dc4f2c880')

            if (!creator) {
                throw new Error('User not found')
            }

            const createdEvent = await event.save()
            creator.createdEvents.push(event)
            await creator.save()
            return eventResponse(createdEvent._doc)
        } catch (err) {
            throw err
        }
    },
    createUser: async (args) => {
        try {
            const password = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password
            })
            const result = await user.save()
            return {...result._doc}
        } catch (err) {
            throw err
        }
    }
}

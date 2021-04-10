const bcrypt = require('bcryptjs')
const { formatDate } = require('../../utils')
const { Event, User } = require('../../models')

const events = async (eventIds) => {
    const result = await Event.find({ _id: { $in: eventIds } })
    return result.map(event => ({...event._doc, date: formatDate(event._doc.date), creator: user.bind(this, event._doc.creator)}))
}

const user = async (userId) => {
    const result = await User.findById(userId)
    return {...result._doc, createdEvents: events.bind(this, result._doc.createdEvents)}
}

const eventResponse = (event) => ({...event._doc, date: formatDate(event._doc.date), creator: user.bind(this, event._doc.creator)})

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => eventResponse(event))
        } catch {
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
            return eventResponse(createdEvent)
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
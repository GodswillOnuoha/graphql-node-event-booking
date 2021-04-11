const { User, Event } = require('../../models')
const { eventResponse } = require('./utils')

const createEvent = async (args) => {
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
}

const events = async () => {
    try {
        const events = await Event.find()
        return events.map(event => eventResponse(event._doc))
    } catch (err) {
        throw err
    }
}

module.exports = { createEvent, events }

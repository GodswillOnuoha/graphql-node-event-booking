const bcrypt = require('bcryptjs')

const { User } = require('../../models')
const eventResolvers = require('./event')
const bookingResolvers = require('./booking')

const createUser = async (args) => {
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


module.exports = { createUser, ...eventResolvers, ...bookingResolvers }

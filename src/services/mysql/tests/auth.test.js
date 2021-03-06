import test from 'ava'
const { connection, errorHandler } = require('./setup')

const users = require('../users')({ connection, errorHandler })
const auth = require('../auth')({ connection, errorHandler })

const create = () => users.save('user@test.com', '123456')

test.beforeEach(t => connection.query('TRUNCATE TABLE users'))
test.after.always(t => connection.query('TRUNCATE TABLE users'))

test('User login - success', async t => {
    await create()
    const result = await auth.authenticate('user@test.com', '123456')
    t.not(result.token, null)
    t.not(result.token.length, 0)
})

test('User login - fail', async t => {
    await create()
    const promisse = auth.authenticate('user-error@test.com', '123456')
    const error = await t.throws(promisse)
    t.is(error.error, 'Failed to find user')
})

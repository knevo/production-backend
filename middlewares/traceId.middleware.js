// https://habr.com/en/post/442392/

const cls = require('cls-hooked')
const uuidv4 = require('uuid/v4')

const clsNamespace = cls.createNamespace('app')

const clsMiddleware = (req, res, next) => {
    // req and res are event emitters. We want to access CLS context inside of their event callbacks
    clsNamespace.bind(req)
    clsNamespace.bind(res)

    const traceID = uuidv4()

    clsNamespace.run(() => {
        clsNamespace.set('traceID', traceID)
        if (req.session && req.session.user) {
            clsNamespace.set('user', req.session.user)
        }
        next()
    })
}

module.exports = clsMiddleware
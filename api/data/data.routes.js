const express = require('express')
const { getUser, getUsers, deleteUser, updateUser, addUser } = require('./data.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAdmin)

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.post('/', addUser)
router.delete('/:id', deleteUser)

module.exports = router
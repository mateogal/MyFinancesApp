const express = require('express')
const router = express.Router({ mergeParams: true })
const passport = require("passport")

const {
    userRegister,
    userLogin,
    refreshToken,
    userData,
    logout
} = require('../controllers/authController.js')

const {
    verifyUser
} = require("../authenticate")

router.route('/register').post(userRegister)
router.post("/login", passport.authenticate("local"), userLogin)
router.post("/refreshToken", refreshToken)
router.get("/user", verifyUser, userData)
router.get("/logout", verifyUser, logout)

module.exports = router
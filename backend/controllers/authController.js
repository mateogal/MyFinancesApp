const User = require('../models/User')
const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../authenticate")
const jwt = require("jsonwebtoken")

const userRegister = async (req, res, next) => {
    User.register(
        new User({
            username: req.body.username,
            email: req.body.email,
            accountBalance: 0,
            spentTransactions: [],
            incomeTransactions: [],
            bankAccounts: [],
            bankCards: [],
            totalIncome: 0,
            totalSpent: 0
        }),
        req.body.password,
        (err, user) => {
            if (err) {
                console.log(err)
                if (err.name === 'MongoServerError' && err.code === 11000) {
                    res.statusCode = 500
                    res.send({
                        message: "E-mail no válido o ya usado."
                    })
                } else {
                    res.statusCode = 500
                    res.send(err)
                }
            } else {
                user.firstName = req.body.firstName
                user.lastName = req.body.lastName
                const token = getToken({ _id: user._id })
                const refreshToken = getRefreshToken({ _id: user._id })
                user.refreshToken.push({ refreshToken })
                user.save((err, user) => {
                    if (err) {
                        console.log(err)
                        if (err.name === 'MongoServerError' && err.code === 11000) {
                            res.statusCode = 500
                            res.send({
                                message: "E-mail no válido o ya usado."
                            })
                        } else {
                            res.statusCode = 500
                            res.send(err)
                        }

                    } else {
                        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                        res.send({ success: true, token })
                    }
                })
            }
        }
    )
}

const userLogin = async (req, res, next) => {
    const token = getToken({ _id: req.user._id })
    const refreshToken = getRefreshToken({ _id: req.user._id })
    User.findById(req.user._id).then(
        user => {
            user.refreshToken.push({ refreshToken })
            user.save((err, user) => {
                if (err) {
                    res.statusCode = 500
                    res.send(err)
                } else {
                    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                    res.send({ success: true, token })
                }
            })
        },
        err => next(err)
    )
}

const refreshToken = async (req, res, next) => {
    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies

    if (refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            const userId = payload._id
            User.findOne({ _id: userId }).then(
                user => {
                    if (user) {
                        // Find the refresh token against the user record in database
                        const tokenIndex = user.refreshToken.findIndex(
                            item => item.refreshToken === refreshToken
                        )

                        if (tokenIndex === -1) {
                            res.statusCode = 401
                            res.send("Unauthorized")
                        } else {
                            const token = getToken({ _id: userId })
                            // If the refresh token exists, then create new one and replace it.
                            const newRefreshToken = getRefreshToken({ _id: userId })
                            user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken }
                            user.save((err, user) => {
                                if (err) {
                                    res.statusCode = 500
                                    res.send(err)
                                } else {
                                    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
                                    res.send({ success: true, token })
                                }
                            })
                        }
                    } else {
                        res.statusCode = 401
                        res.send("Unauthorized")
                    }
                },
                err => next(err)
            )
        } catch (err) {
            res.statusCode = 401
            res.send("Unauthorized")
        }
    } else {
        res.statusCode = 401
        res.send("Unauthorized")
    }
}

const userData = async (req, res, next) => {
    res.send(req.user)
}

const logout = async (req, res, next) => {
    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies
    User.findById(req.user._id).then(
        user => {
            const tokenIndex = user.refreshToken.findIndex(
                item => item.refreshToken === refreshToken
            )

            if (tokenIndex !== -1) {
                user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove()
            }

            user.save((err, user) => {
                if (err) {
                    res.statusCode = 500
                    res.send(err)
                } else {
                    res.clearCookie("refreshToken", COOKIE_OPTIONS)
                    res.send({ success: true })
                }
            })
        },
        err => next(err)
    )
}

module.exports = {
    userRegister,
    userLogin,
    refreshToken,
    userData,
    logout
}
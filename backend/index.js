const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const passport = require("passport")
const connectDB = require('./config/db')
const session = require('express-session');

require('dotenv').config()
require("./strategies/JwtStrategy")
require("./strategies/LocalStrategy")
require("./authenticate")

const binanceRouter = require('./routes/binance')
const accountRouter = require('./routes/account')
const authRouter = require('./routes/auth')

const app = express()
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true,
    // Since localhost is not having https protocol,
    // secure cookies do not work correctly (in postman)
    secure: true,
    signed: true,
    maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
    sameSite: "none",
  }
}))

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : ["http://localhost:3000"]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(express.static('public'))

app.use(passport.initialize())

app.get('/', (req, res) => {
  console.log(req.query)
  res.send('Hello')
})
app.use('/api/binance', binanceRouter)
app.use('/api/account', accountRouter)
app.use('/api/auth', authRouter)

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_REMOTE_URI)
    const listener = app.listen(PORT, () => {
      console.log('Your app is listening on port ' + listener.address().port)
    })
  } catch (err) {
    console.log(err)
  }
}

start()
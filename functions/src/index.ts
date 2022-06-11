import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from 'express'
import { noAuthRouter, authRouter } from './router'
admin.initializeApp();

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const verifyLogin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const jwt = req.headers["authorization"]?.split(" ")[1]
  if (jwt === undefined) {
    console.log('1')
    res.sendStatus(403)
  } else {
    try {
      admin.auth().verifyIdToken(jwt).then(user => {
        if (Date.now() < user.exp * 1000) {
          res.locals.uid = user.uid
          next()
        } else {
          res.sendStatus(403)
        }
      })
    } catch (err) {
      res.status(403)
    }
  }
}

app.use('/', noAuthRouter)
app.use('/', verifyLogin, authRouter)

exports.app = functions.region('us-central1').https.onRequest(app)

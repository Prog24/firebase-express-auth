import * as admin from 'firebase-admin'
import { Request, Response } from 'express'

const signin = async (request: Request, response: Response) => {
  const jwt = request.headers["authorization"]?.split(" ")[1]
  admin.auth().verifyIdToken(jwt!).then((verifyIdTokenRes) => {
    admin.firestore().collection('users').doc(verifyIdTokenRes.uid).get().then(checkUser => {
      const user = checkUser.data()
      if (user) {
        // 登録済みの場合
        admin.firestore().collection('users').doc(verifyIdTokenRes.uid).update({
          lastLogin: new Date()
        }).then((_res) => {
          response.json({ message: 'already account' })
        })
      } else {
        // 未登録の場合
        admin.firestore().collection('users').doc(verifyIdTokenRes.uid).set({
          userId: verifyIdTokenRes.uid,
          createdAt: new Date()
        }).then((_res) => {
          response.json({ message: 'new account' })
        })
      }
    }).catch((err) => {
      response.status(500).json({ message: err.message })
    })
  })
}

export { signin }

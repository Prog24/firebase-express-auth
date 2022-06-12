import * as admin from 'firebase-admin'
import { Request, Response } from 'express'

const checkLogin = async (request: Request, response: Response) => {
  const jwt = request.headers["authorization"]?.split(" ")[1]
  admin.auth().verifyIdToken(jwt!).then((res) => {
    console.log("SUCCESS>>>")
    console.log(res)
    response.json({'message': 'success'})
  }).catch((err) => {
    console.log("ERROR>>>>")
    console.error(err)
    response.status(400).json({'message': 'error'})
  })
}

const signup = async (request: Request, response: Response) => {
  // 新規登録
  // req: UID, CTIME, UTIME
  const jwt = request.headers["authorization"]?.split(" ")[1]
  admin.auth().verifyIdToken(jwt!).then((res) => {
    if (res.uid === request.body.uid) {
      admin.firestore().collection("users").doc(request.body.uid).set({
        userId: request.body.uid,
        createdAt: new Date()
      })
      response.sendStatus(200)
    } else {
      response.status(400).json({ message: 'error' })
    }
  }).catch((err) => {
    console.error(err)
    response.status(400).json({message: 'error'})
  })
  // TODO: 既にアカウントがあるかどうか確認
}

export { checkLogin, signup }



// const login =  async (req: Request, res: Response) => {
//   // ログイン
//   // req: UID
// }

// const deleteUser = async (req: Request, res: Response) => {
//   // 退会
// }
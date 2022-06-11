import * as admin from 'firebase-admin'
import { Request, Response } from 'express'

const createQuestion = async (request: Request, response: Response) => {
  console.log(response.locals.uid)
  admin.firestore().collection("question").doc(request.body.id).set({
    createAt: new Date(),
    body: request.body.body,
    userId: 'hogehoge'
  })
  response.sendStatus(200)
}

const getAllQuestion = async (request: Request, response: Response) => {
  const snapshot = await admin.firestore().collection('question').orderBy('createAt', 'desc').get()
  const hoge = snapshot.docs.map(doc => doc.data())
  response.json(hoge)
}

const getMyQuestion = async (request: Request, response: Response) => {
  const snapshot = await admin.firestore().collection('question').where('userId', '==', response.locals.uid).orderBy('createAt', 'desc').get()
  const data = snapshot.docs.map(doc => doc.data())
  response.json(data)
}

export { createQuestion, getAllQuestion, getMyQuestion }

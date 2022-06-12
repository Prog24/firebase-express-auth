import * as admin from 'firebase-admin'
import { Request, Response } from 'express'

const createQuestion = async (request: Request, response: Response) => {
  const uuid = admin.firestore().collection("question").doc().id
  admin.firestore().collection("question").doc(uuid).set({
    createAt: new Date(),
    body: request.body.body,
    userId: response.locals.uid,
    uuid: uuid,
    tags: (request.body.tags ?? [])
  })
  response.sendStatus(200)
}

const getAllQuestion = async (request: Request, response: Response) => {
  const queryMe = request.query.me
  const solved = request.query.solved
  const tags = request.query.tags
  if (queryMe) {
    const snapshot = await admin.firestore().collection('question').where('userId', '==', response.locals.uid).orderBy('createAt', 'desc').get()
    const data = snapshot.docs.map(doc => doc.data())
    response.json(data)
  } else if (solved) {
    const snapshot = await admin.firestore().collection('question').where('solved', '==', true).orderBy('createAt', 'desc').get()
    const data = snapshot.docs.map(doc => doc.data())
    response.json(data)
  } else if (tags) {
    const tagsArray = Array.isArray(tags) ? tags : Array(tags)
    console.log(tagsArray)
    const snapshot = await admin.firestore().collection('question').where('tags', 'array-contains-any', tagsArray).orderBy('createAt', 'desc').get()
    const data = snapshot.docs.map(doc => doc.data())
    response.json(data)
  } else {
    const snapshot = await admin.firestore().collection('question').orderBy('createAt', 'desc').get()
    const data = snapshot.docs.map(doc => doc.data())
    response.json(data)
  }
}

const getOneQuestion = async (request: Request, response: Response) => {
  const snapshot = await admin.firestore().collection('question').doc(request.params.id).get()
  const data = snapshot.data()
  response.json(data)
}

const deleteQuestion = async (request: Request, response: Response) => {
  await admin.firestore().collection("question").doc(request.params.id).delete()
  response.sendStatus(200)
}

export { createQuestion, getAllQuestion, getOneQuestion, deleteQuestion }

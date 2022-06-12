import * as admin from 'firebase-admin'
import { Request, Response } from 'express'

const createQuestion = async (request: Request, response: Response) => {
  const uuid = admin.firestore().collection("question").doc().id
  admin.firestore().collection("question").doc(uuid).set({
    createAt: new Date(),
    body: request.body.body,
    userId: response.locals.uid,
    uuid: uuid,
    tags: (request.body.tags ?? []),
    resolved: false
  })
  response.sendStatus(200)
}

const getAllQuestion = async (request: Request, response: Response) => {
  const queryMe = request.query.me
  const resolved = request.query.resolved
  const tags = request.query.tags
  var baseQuery = admin.firestore().collection('question')
  if (queryMe) {
    baseQuery = baseQuery.where('userId', '==', response.locals.uid) as any
  }
  if (resolved) {
    baseQuery = baseQuery.where('resolved', '==', resolved) as any
  }
  if (tags) {
    const tagsArray = Array.isArray(tags) ? tags : Array(tags)
    baseQuery = baseQuery.where('tags', 'array-contains-any', tagsArray) as any
  }
  const snapshot = await baseQuery.orderBy('createAt', 'desc').get()
  const data = snapshot.docs.map(doc => doc.data())
  response.json(data)
}

const getOneQuestion = async (request: Request, response: Response) => {
  const snapshot = await admin.firestore().collection('question').doc(request.params.id).get()
  const data = snapshot.data()
  response.json(data)
}

const updateQuestion = async (request: Request, response: Response) => {
  const check = (await admin.firestore().collection('question').doc(request.params.id).get()).data()
  if (check!.userId !== response.locals.uid) {
    // 自分の悩みじゃない場合は編集不可
    response.status(400).json({ message: 'not user' })
    return
  }
  await admin.firestore().collection('question').doc(request.params.id).update({
    updateAt: new Date(),
    body: request.body.body,
    tags: (request.body.tags ?? []),
    resolved: (request.body.resolved ?? false)
  }).then(_res => {
    response.sendStatus(200)
  }).catch(err => {
    response.status(400).json({ message: err.message })
  })
}

const deleteQuestion = async (request: Request, response: Response) => {
  const check = (await admin.firestore().collection('question').doc(request.params.id).get()).data()
  if (check!.userId !== response.locals.uid) {
    // 自分の悩みじゃない場合は削除不可
    response.status(400).json({ message: 'not user' })
    return
  }
  await admin.firestore().collection("question").doc(request.params.id).delete().then(_res => {
    response.sendStatus(200)
  }).catch(err => {
    response.status(400).json({ message: err.message })
  })
}

export { createQuestion, getAllQuestion, getOneQuestion, updateQuestion, deleteQuestion }

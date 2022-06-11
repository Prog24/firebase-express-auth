import * as admin from 'firebase-admin'
import { Request, Response } from 'express'

const createDocument = async (req: Request, res: Response) => {
  await admin.firestore().collection("test").doc("abc").set({a: 123});
  res.sendStatus(200)
}

const updateDocument = async (req: Request, res: Response) => {
  await admin.firestore().collection("test").doc("abc").update({a: 234, b: 345});
  res.sendStatus(200)
}

const deleteDocument = async (req: Request, res: Response) => {
  await admin.firestore().collection("test").doc("abc").delete();
  res.sendStatus(200)
}

const getDocument = async (req: Request, res: Response) => {
  const data = await admin.firestore().collection("test").doc("abc").get()
  const response = data.data()
  res.send(response)
}

export { createDocument, updateDocument, deleteDocument, getDocument }

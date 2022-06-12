import * as express from 'express'

import { createDocument, updateDocument, deleteDocument, getDocument } from './api/document'
import { signup } from './api/user'
import { createQuestion, getAllQuestion, getOneQuestion, deleteQuestion } from './api/question'

const noAuthRouter = express.Router()
const authRouter = express.Router()

noAuthRouter.get('/api/document', getDocument)
noAuthRouter.post('/api/document', createDocument)
noAuthRouter.put('/api/document', updateDocument)
noAuthRouter.delete('/api/document', deleteDocument)
noAuthRouter.post('/api/user', signup)

authRouter.post('/api/question', createQuestion)
authRouter.get('/api/question', getAllQuestion)
authRouter.get('/api/question/:id', getOneQuestion)
authRouter.delete('/api/question/:id', deleteQuestion)

export { noAuthRouter, authRouter }

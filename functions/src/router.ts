import * as express from 'express'

import { createDocument, updateDocument, deleteDocument, getDocument } from './api/document'
import { signin } from './api/user'
import { createQuestion, getAllQuestion, getOneQuestion, updateQuestion, deleteQuestion } from './api/question'

const noAuthRouter = express.Router()
const authRouter = express.Router()

noAuthRouter.get('/api/document', getDocument)
noAuthRouter.post('/api/document', createDocument)
noAuthRouter.put('/api/document', updateDocument)
noAuthRouter.delete('/api/document', deleteDocument)

authRouter.post('/api/signin', signin)
authRouter.post('/api/question', createQuestion)
authRouter.get('/api/question', getAllQuestion)
authRouter.get('/api/question/:id', getOneQuestion)
authRouter.put('/api/question/:id', updateQuestion)
authRouter.delete('/api/question/:id', deleteQuestion)

export { noAuthRouter, authRouter }

import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import {
  requestExchange,
  getReceivedExchanges,
  getMyExchangeRequests,
  getExchangeDetail,
  updateExchange,
  updateExchangeStatus,
  deleteExchange
} from '../controllers/exchangeController.js'

const router = express.Router()

// Mounted at /api/exchanges

// 1) Buat request tukar
router.post(   '/',                authMiddleware, requestExchange)

// 2) Request masuk
router.get(    '/received',        authMiddleware, getReceivedExchanges)

// 3) Request yang dikirim user
router.get(    '/sent',            authMiddleware, getMyExchangeRequests)

// 4) Detail 1 request
router.get(    '/:id',             authMiddleware, getExchangeDetail)

// 5) Update isi request (offeredBookId, messages, lokasi, dsb.)
router.put(    '/:id',             authMiddleware, updateExchange)

// 6) Update status saja
router.patch(  '/:id/status',      authMiddleware, updateExchangeStatus)

// 7) Hapus request (requester & masih pending)
router.delete( '/:id',             authMiddleware, deleteExchange)

export default router

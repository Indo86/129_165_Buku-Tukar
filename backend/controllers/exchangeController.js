// controllers/exchangeController.js
import Exchange from '../models/Exchange.js'
import Book     from '../models/Book.js'
import User     from '../models/User.js'

/**
 * POST /exchanges
 * Buat permintaan tukar buku
 */
export const requestExchange = async (req, res) => {
  const requesterId = req.userId
  const {
    offeredBookId,
    requestedBookId,
    messages,
    location,
    meetingDatetime
  } = req.body

  try {
    // 1. Verifikasi: offeredBook milik requester
    const offeredBook = await Book.findOne({
      where: { id: offeredBookId, userId: requesterId }
    })
    if (!offeredBook) {
      return res.status(400).json({
        status: 'Error',
        message: 'Buku yang ditawarkan tidak ditemukan atau bukan milik Anda'
      })
    }

    // 2. Ambil requestedBook & ownerId
    const requestedBook = await Book.findByPk(requestedBookId)
    if (!requestedBook) {
      return res.status(400).json({
        status: 'Error',
        message: 'Buku yang diminta tidak ditemukan'
      })
    }
    const ownerId = requestedBook.userId

    // 3. Buat record Exchange
    const exchange = await Exchange.create({
      requesterId,
      ownerId,
      offeredBookId,
      requestedBookId,
      messages:        messages || null,
      location:        location || null,
      meetingDatetime: meetingDatetime || null,
      status:          'pending'
    })

    return res.status(201).json({
      status:  'Success',
      message: 'Permintaan tukar berhasil dibuat',
      data:    exchange
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status:  'Error',
      message: 'Gagal membuat permintaan tukar',
      error:   error.message
    })
  }
}

/**
 * GET /exchanges/received
 * Ambil semua request masuk (pending) untuk buku user
 */
export const getReceivedExchanges = async (req, res) => {
  const ownerId = req.userId

  try {
    const exchanges = await Exchange.findAll({
      where: { ownerId, status: 'pending' },
      attributes: [
        'id',
        'messages',
        'location',
        'meetingDatetime',
        'status',
        'createdAt'
      ],
      include: [
        {
          model: User,
          as: 'requester',
          attributes: [
            'id',
            'username',
            'email',
            'whatsappNumber',
            'avatarUrl'
          ]
        },
        {
          model: Book,
          as: 'offeredBook',
          attributes: ['id', 'title', 'author', 'imageUrl']
        },
        {
          model: Book,
          as: 'requestedBook',
          attributes: ['id', 'title', 'author', 'imageUrl']
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    return res.status(200).json({
      status: 'Success',
      data:   exchanges
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status:  'Error',
      message: 'Gagal mengambil permintaan tukar masuk',
      error:   error.message
    })
  }
}

/**
 * GET /exchanges/sent
 * Ambil semua request yang dibuat user (sudah atau belum diproses)
 */
export const getMyExchangeRequests = async (req, res) => {
  const requesterId = req.userId

  try {
    const exchanges = await Exchange.findAll({
      where: { requesterId },
      attributes: [
        'id',
        'messages',
        'location',
        'meetingDatetime',
        'status',
        'createdAt'
      ],
      include: [
        {
          model: User,
          as: 'owner',
          attributes: [
            'id',
            'username',
            'email',
            'whatsappNumber',
            'avatarUrl'
          ]
        },
        {
          model: Book,
          as: 'offeredBook',
          attributes: ['id', 'title', 'author', 'imageUrl']
        },
        {
          model: Book,
          as: 'requestedBook',
          attributes: ['id', 'title', 'author', 'imageUrl']
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    return res.status(200).json({
      status: 'Success',
      data:   exchanges
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status:  'Error',
      message: 'Gagal mengambil permintaan tukar Anda',
      error:   error.message
    })
  }
}

/**
 * PUT /exchanges/:id/status
 * Update status permintaan tukar (accept / decline / complete)
 */
export const updateExchangeStatus = async (req, res) => {
  const exchangeId = Number(req.params.id)
  const userId     = req.userId
  const { status } = req.body

  // Validasi status
  const valid = ['pending','accepted','declined','cancelled','completed']
  if (!valid.includes(status)) {
    return res.status(400).json({
      status: 'Error',
      message: `Status harus salah satu dari: ${valid.join(', ')}`
    })
  }

  try {
    const exchange = await Exchange.findByPk(exchangeId)
    if (!exchange) {
      return res.status(404).json({
        status: 'Error',
        message: 'Permintaan tukar tidak ditemukan'
      })
    }

    // Hanya owner yang boleh merubah
    if (exchange.ownerId !== userId) {
      return res.status(403).json({
        status: 'Error',
        message: 'Anda tidak berhak mengubah status ini'
      })
    }

    exchange.status = status
    await exchange.save()

    return res.status(200).json({
      status:  'Success',
      message: 'Status permintaan tukar berhasil diupdate',
      data:    exchange
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status:  'Error',
      message: 'Gagal mengupdate status tukar',
      error:   error.message
    })
  }
}

/**
 * GET /exchanges/:id
 * Ambil detail 1 exchange (include requester, owner, offeredBook, requestedBook)
 */
export const getExchangeDetail = async (req, res) => {
  const id = Number(req.params.id)
  try {
    const ex = await Exchange.findByPk(id, {
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['id','username','email','whatsappNumber','avatarUrl']
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id','username','email','whatsappNumber','avatarUrl']
        },
        {
          model: Book,
          as: 'offeredBook',
          attributes: ['id','title','author','imageUrl','status']
        },
        {
          model: Book,
          as: 'requestedBook',
          attributes: ['id','title','author','imageUrl','status']
        }
      ]
    })
    if (!ex) {
      return res.status(404).json({ status:'Error', message:'Request tukar tidak ditemukan' })
    }
    return res.status(200).json({ status:'Success', data: ex })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      status:'Error',
      message:'Gagal mengambil detail request',
      error: err.message
    })
  }
}

/**
 * PUT /exchanges/:id
 * Update isi request pertukaran (sebelum diproses)
 */
export const updateExchange = async (req, res) => {
  const id = Number(req.params.id)
  const userId = req.userId
  const {
    offeredBookId,
    messages,
    location,
    meetingDatetime
  } = req.body

  try {
    const ex = await Exchange.findByPk(id)
    if (!ex) {
      return res.status(404).json({ status:'Error', message:'Request tukar tidak ditemukan' })
    }
    // Hanya requester yang boleh edit, dan hanya saat masih pending
    if (ex.requesterId !== userId || ex.status !== 'pending') {
      return res.status(403).json({
        status:'Error',
        message:'Anda tidak berhak mengubah ini'
      })
    }

    // Verifikasi offeredBookId milik requester
    const own = await Book.findOne({ where:{ id:offeredBookId, userId } })
    if (!own) {
      return res.status(400).json({
        status:'Error',
        message:'Buku tawaran tidak valid'
      })
    }

    // Lakukan update
    ex.offeredBookId   = offeredBookId
    ex.messages        = messages        || ex.messages
    ex.location        = location        || ex.location
    ex.meetingDatetime = meetingDatetime || ex.meetingDatetime
    await ex.save()

    return res.status(200).json({
      status:'Success',
      message:'Request tukar berhasil diperbarui',
      data: ex
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      status:'Error',
      message:'Gagal memperbarui request',
      error: err.message
    })
  }
}

/**
 * DELETE /exchanges/:id
 * Hapus request pertukaran (hanya requester saat masih "pending")
 */
export const deleteExchange = async (req, res) => {
  const id     = Number(req.params.id)
  const userId = req.userId
  try {
    const ex = await Exchange.findByPk(id)
    if (!ex) {
      return res.status(404).json({
        status: 'Error',
        message: 'Request tukar tidak ditemukan'
      })
    }
    // Hanya requester yang boleh menghapus, dan hanya saat status masih "pending"
    if (ex.requesterId !== userId || ex.status !== 'pending') {
      return res.status(403).json({
        status: 'Error',
        message: 'Anda tidak berhak menghapus request ini'
      })
    }
    await ex.destroy()
    return res.status(200).json({
      status:  'Success',
      message: 'Request tukar berhasil dihapus'
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status:  'Error',
      message: 'Gagal menghapus request tukar',
      error:   error.message
    })
  }
}
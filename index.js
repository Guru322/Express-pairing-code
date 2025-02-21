import { Boom } from '@hapi/boom'
import Baileys, {
  DisconnectReason,
  Browsers,
  makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys'
import cors from 'cors'
import express from 'express'
import path, { dirname } from 'path'
import pino from 'pino'
import { fileURLToPath } from 'url'
import sendsession  from 'txt-fyi-api'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'client', 'build')))

const PORT = process.env.PORT || 8000


const clients = new Set()

wss.on('connection', (ws) => {
  clients.add(ws)
  ws.on('close', () => clients.delete(ws))
})

const broadcastSessionId = (sessionId) => {
  const message = JSON.stringify({ sessionId })
  clients.forEach(client => {
    if (client.readyState === 1) { 
      client.send(message)
    }
  })
}

app.post('/pair', async (req, res) => {
  const { phone } = req.body

  if (!phone) return res.json({ error: 'Please Provide Phone Number' })

  try {
    const code = await startWhatsApp(phone)
    res.json({ code: code })
  } catch (error) {
    console.error('Error in WhatsApp authentication:', error)
    res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
})

async function startWhatsApp(phone) {
  return new Promise(async (resolve, reject) => {
    try {
      const state = {
        creds: {},
        keys: {}
      }

      const saveState = async () => {
        try {
          const stringifiedState = JSON.stringify(state)
          const result = await sendsession(stringifiedState)
          if (result.success) {
            console.log('Session ID:', result.output)
            broadcastSessionId(result.output)
            return result.output
          } else {
            throw new Error('Failed to save state')
          }
        } catch (error) {
          console.error('Error saving state:', error)
          throw error
        }
      }

      const negga = Baileys.makeWASocket({
        version: [2, 3000, 1015901307],
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: Browsers.ubuntu("Chrome"),
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(
            state.keys,
            pino().child({
              level: 'fatal',
              stream: 'store',
            })
          ),
        },
      })

      if (!negga.authState.creds.registered) {
        let phoneNumber = phone ? phone.replace(/[^0-9]/g, '') : ''
        if (phoneNumber.length < 11) {
          return reject(new Error('Please Enter Your Number With Country Code !!'))
        }
        setTimeout(async () => {
          try {
            let code = await negga.requestPairingCode(phoneNumber)
            console.log(`Your Pairing Code : ${code}`)
            resolve(code)
          } catch (requestPairingCodeError) {
            const errorMessage = 'Error requesting pairing code from WhatsApp'
            console.error(errorMessage, requestPairingCodeError)
            return reject(new Error(errorMessage))
          }
        }, 3000)
      }

      negga.ev.on('creds.update', async (creds) => {
        state.creds = creds
        await saveState()
      })

      negga.ev.on('connection.update', async update => {
        const { connection, lastDisconnect } = update

        if (connection === 'open') {
          const sessionId = await saveState()
          console.log('Connected to WhatsApp Servers')
        }

        if (connection === 'close') {
          let reason = new Boom(lastDisconnect?.error)?.output.statusCode
          if (reason === DisconnectReason.restartRequired) {
            startWhatsApp()
          } else {
            process.send('reset')
          }
        }
      })

      negga.ev.on('messages.upsert', () => {})
    } catch (error) {
      console.error('An Error Occurred:', error)
      throw new Error(error.message || 'An Error Occurred')
    }
  })
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
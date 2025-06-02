import { Boom } from '@hapi/boom'
import Baileys, {
  DisconnectReason,
  delay,
  Browsers
} from 'baileys-pro'
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import path, { dirname } from 'path'
import pino from 'pino'
import { fileURLToPath } from 'url'
import { useMongoDBAuthState } from './auth/mongo-auth.js'

const app = express()

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')

  res.setHeader('Pragma', 'no-cache')

  res.setHeader('Expires', '0')
  next()
})

app.use(cors())
app.use(express.json())



let PORT = process.env.PORT || 8000
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//in-memory for process lifecycle >;<
const activeSessions = new Map()

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

/* app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/qr', async (req, res) => {
  res.sendFile(path.join(__dirname, 'qr.html'))
})

app.get('/code', async (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
}); */

app.post('/pair', async (req, res) => {
  const { phone, mongoUrl } = req.body

  if (!phone) return res.status(400).json({ error: 'Please Provide Phone Number' })
  if (!mongoUrl) return res.status(400).json({ error: 'Please Provide MongoDB Connection URL' })

  const sessionId = `Guruai_${phone.replace(/[^0-9]/g, '')}_${Date.now()}`

  try {
    const code = await startnigg(phone, mongoUrl, sessionId)
    res.json({ code: code, sessionId: sessionId })
  } catch (error) {
    console.error('Error in WhatsApp authentication:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

async function startnigg(phone, mongoUrl, sessionId, isRestart = false) {
  return new Promise(async (resolve, reject) => {
    let authStateManager = null
    try {
      console.log(`[${sessionId}] Establishing MongoDB connection...`)
      authStateManager = await useMongoDBAuthState(mongoUrl, sessionId)
      const { state, saveCreds } = authStateManager
      console.log(`[${sessionId}] MongoDB connection established successfully`)

      activeSessions.set(sessionId, { phone, mongoUrl, authStateManager })

      await delay(1000)

      const negga = Baileys.makeWASocket({
        printQRInTerminal: false,
        logger: pino({
          level: 'trace',
        }),
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: state,
      })

      if (!negga.authState.creds.registered && !isRestart) {
        let phoneNumber = phone ? phone.replace(/[^0-9]/g, '') : ''
        if (phoneNumber.length < 11) {
          return reject(new Error('Please Enter Your Number With Country Code !!'))
        }
        setTimeout(async () => {
          try {
            let code = await negga.requestPairingCode(phoneNumber, "GuruAiii")
            console.log(`Your Pairing Code : ${code}`)
            resolve(code)
          } catch (requestPairingCodeError) {
            const errorMessage = 'Error requesting pairing code from WhatsApp'
            console.error(errorMessage, requestPairingCodeError)
            return reject(new Error(errorMessage))
          }
        }, 3000)
      }

      negga.ev.on('creds.update', saveCreds)

      negga.ev.on('connection.update', async update => {
        const { connection, lastDisconnect } = update

        if (connection === 'open') {
          await delay(10000)
          
          await delay(2000)
          let guru = await negga.sendMessage(negga.user.id, { text: "Successfully Stored Session to MongoDB" })
          await delay(2000)
          await negga.sendMessage(
            negga.user.id,
            {
              text: `Hello there! 👋 \n\nYour session has been created successfully!\n\nSession ID: ${sessionId}\n\nUse the same MongoDB connection URL to reconnect\n\nDo not share your MongoDB details with anyone.\n\nThanks for using GURU-AI\n\njoin support group:- https://chat.whatsapp.com/JY4R2D22pbLIKBMQWyBaLg \n`,
            },
            { quoted: guru }
          )

          console.log(`[${sessionId}] Connected to WhatsApp Servers`)
          
          try {
            if (authStateManager && authStateManager.closeConnection) {
              await authStateManager.closeConnection()
            }
            activeSessions.delete(sessionId)
          } catch (error) {
            console.error(`[${sessionId}] Error closing MongoDB connection:`, error)
          }

          console.log(`[${sessionId}] MongoDB connection closed upon successful connection`)
          process.send('reset')
        }

        if (connection === 'close') {
          let reason = new Boom(lastDisconnect?.error)?.output.statusCode
          console.log(`[${sessionId}] Connection Closed:`, reason)
          
          try {
            if (authStateManager && authStateManager.closeConnection) {
              await authStateManager.closeConnection()
            }
          } catch (error) {
            console.error(`[${sessionId}] Error closing MongoDB connection:`, error)
          }
          
          if (reason === DisconnectReason.connectionClosed) {
            console.log(`[${sessionId}] Connection closed, reconnecting....!`)
            process.send('reset')
          } else if (reason === DisconnectReason.connectionLost) {
            console.log(`[${sessionId}] Connection Lost from Server, reconnecting....!`)
            process.send('reset')
          } else if (reason === DisconnectReason.loggedOut) {
            console.log(`[${sessionId}] Device Logged Out, Please Try to Login Again....!`)
            activeSessions.delete(sessionId)
            process.send('reset')
          } else if (reason === DisconnectReason.restartRequired) {
            console.log(`[${sessionId}] Server Restarting....!`)
            const sessionInfo = activeSessions.get(sessionId)
            if (sessionInfo) {
              console.log(`[${sessionId}] Restarting with stored credentials...`)
              startnigg(sessionInfo.phone, sessionInfo.mongoUrl, sessionId, true)
            } else {
              console.log(`[${sessionId}] No stored credentials available for restart`)
              process.send('reset')
            }
          } else if (reason === DisconnectReason.timedOut) {
            console.log(`[${sessionId}] Connection Timed Out, Trying to Reconnect....!`)
            process.send('reset')
          } else if (reason === DisconnectReason.badSession) {
            console.log(`[${sessionId}] BadSession exists, Trying to Reconnect....!`)
            activeSessions.delete(sessionId)
            process.send('reset')
          } else if (reason === DisconnectReason.connectionReplaced) {
            console.log(`[${sessionId}] Connection Replaced, Trying to Reconnect....!`)
            process.send('reset')
          } else {
            console.log(`[${sessionId}] Server Disconnected: Maybe Your WhatsApp Account got Fucked....!`)
            activeSessions.delete(sessionId)
            process.send('reset')
          }
        }
      })

      negga.ev.on('messages.upsert', () => {})
    } catch (error) {
      console.error(`[${sessionId}] An Error Occurred:`, error)
      try {
        if (authStateManager && authStateManager.closeConnection) {
          await authStateManager.closeConnection()
        }
        activeSessions.delete(sessionId)
      } catch (closeError) {
        console.error(`[${sessionId}] Error closing MongoDB connection:`, closeError)
      }
      throw new Error('An Error Occurred')
    }
  })
}

app.listen(PORT, () => {
  console.log(`API Running on PORT:${PORT}`)
})
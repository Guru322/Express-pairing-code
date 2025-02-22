import { Boom } from '@hapi/boom';
import makeWASocket, {
  DisconnectReason,
  Browsers,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState
} from '@whiskeysockets/baileys';
import cors from 'cors';
import express from 'express';
import path, { dirname } from 'path';
import pino from 'pino';
import { fileURLToPath } from 'url';
import sendsession from 'txt-fyi-api';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import fs from 'fs';

// Enhanced logging setup
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      timestamp: true,
    },
  },
});

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Express middleware setup
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Express error handling middleware
app.use((err, req, res, next) => {
  logger.error('Express middleware error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

const PORT = process.env.PORT || 8000;
const clients = new Set();

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  logger.info(`New WebSocket connection from ${clientIp}`);
  clients.add(ws);
  
  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
  });
  
  ws.on('close', () => {
    logger.info(`Client ${clientIp} disconnected`);
    clients.delete(ws);
  });
});

// Function to broadcast session ID to all connected WebSocket clients
const broadcastSessionId = (sessionId) => {
  const message = JSON.stringify({ sessionId });
  logger.info(`Broadcasting session ID: ${sessionId} to ${clients.size} clients`);
  
  clients.forEach(client => {
    try {
      if (client.readyState === 1) {
        client.send(message);
      }
    } catch (error) {
      logger.error('Error broadcasting to client:', error);
    }
  });
};

// Endpoint to handle pairing requests
app.post('/pair', async (req, res) => {
  const { phone } = req.body;
  logger.info(`Received pairing request for phone: ${phone}`);
  
  if (!phone) {
    logger.warn('Pairing request received without phone number');
    return res.status(400).json({ error: 'Please Provide Phone Number' });
  }
  
  try {
    const code = await startWhatsApp(phone);
    logger.info(`Successfully generated pairing code for ${phone}`);
    res.json({ code });
  } catch (error) {
    logger.error('Error in WhatsApp authentication:', error);
    res.status(500).json({ 
      error: 'WhatsApp Authentication Failed', 
      details: error.message 
    });
  }
});

// Posts the stringified creds.json content to txt.fyi and returns the session ID
async function saveState() {
  try {
    const credsPath = path.join('auth_info_baileys', 'creds.json');
    if (!fs.existsSync(credsPath)) {
      logger.error('Credentials file not found');
      return;
    }
    const credsData = fs.readFileSync(credsPath, 'utf-8');
    logger.info('Posting creds to txt-fyi');
    const result = await sendsession(credsData);
    if (result.success) {
      logger.info(`State saved successfully. Session ID: ${result.output}`);
      broadcastSessionId(result.output);
      return result.output;
    } else {
      throw new Error('Failed to save state');
    }
  } catch (error) {
    logger.error('Error saving state:', error);
    throw error;
  }
}

// Starts the WhatsApp connection using multi-file auth state and (if needed) pairing code
async function startWhatsApp(phone) {
  try {
    // Initialize multi-file auth state
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      browser: Browsers.ubuntu('MyApp'),
    });
    
    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;
      logger.info(`Connection status update: ${connection}`);
      
      if (connection === 'open') {
        // After connection is open, post creds.json to txt.fyi and broadcast session ID
        const sessionId = await saveState();
        logger.info(`Connected to WhatsApp Servers. Session ID: ${sessionId}`);
      }
      
      if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        logger.warn(`Connection closed. Reason: ${reason}`);
        if (reason === DisconnectReason.restartRequired) {
          logger.info('Restart required, attempting to reconnect');
          startWhatsApp(phone);
        } else {
          process.send?.('reset');
        }
      }
    });
    
    // If the account is not registered, request a pairing code
    if (!sock.authState.creds.registered) {
      let phoneNumber = phone.replace(/[^0-9]/g, '');
      if (phoneNumber.length < 11) {
        logger.warn(`Invalid phone number length: ${phoneNumber.length} digits`);
        throw new Error('Please Enter Your Number With Country Code !!');
      }
      
      // Delay before requesting the pairing code
      setTimeout(async () => {
        try {
          logger.info(`Requesting pairing code for ${phoneNumber}`);
          let code = await sock.requestPairingCode(phoneNumber);
          logger.info('Pairing code generated successfully');
        } catch (error) {
          logger.error('Error requesting pairing code:', error);
          throw new Error('Error requesting pairing code from WhatsApp');
        }
      }, 3000);
    }
    
    // Return a promise that resolves once the connection is open
    return new Promise((resolve, reject) => {
      sock.ev.on('connection.update', async (update) => {
        if (update.connection === 'open') {
          resolve('Connected and session saved');
        }
      });
    });
  } catch (error) {
    logger.error('Fatal error in startWhatsApp:', error);
    throw new Error(error.message || 'An Error Occurred');
  }
}

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`CORS enabled with origin: ${process.env.CORS_ORIGIN || '*'}`);
});

server.on('error', (error) => {
  logger.error('Server error:', error);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

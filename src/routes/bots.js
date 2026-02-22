const express = require('express');
const router = express.Router();
const { encrypt } = require('../crypto');
const db = require('../db');
const logger = require('../logger');

router.post('/', async (req, res) => {
  try {
    const { name, token } = req.body;
    if (!name || !token) return res.status(400).json({ error: 'name and token are required' });
    const master = process.env.MASTER_KEY;
    const encrypted = encrypt(token, master);
    const saved = await db.saveBot(name, encrypted);
    await db.addAudit('ADD_BOT', JSON.stringify({ id: saved.id, name }));
    logger.info('Bot added', { id: saved.id, name });
    res.status(201).json({ id: saved.id, name });
  } catch (err) {
    logger.error('Failed to add bot', { message: err.message });
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const bots = await db.listBots();
    res.json(bots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

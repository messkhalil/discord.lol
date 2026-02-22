require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const botsRoute = require('./routes/bots');
const logger = require('./logger');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend from /public
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/bots', botsRoute);

// Fallback root route -> serve index.html so visiting / shows the UI
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Server listening on ${port}`);
    console.log(`Server listening on ${port}`);
  });
}

module.exports = app;

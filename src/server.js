require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const botsRoute = require('./routes/bots');
const logger = require('./logger');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/bots', botsRoute);

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Server listening on ${port}`);
    console.log(`Server listening on ${port}`);
  });
}

module.exports = app;

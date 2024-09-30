const express = require('express');
const app = express();
const routesAuthentication = require('./routes/authentication');
const routesTasks = require('./routes/task');
const fs = require('fs');
const path = require('path');
const https = require('https');
const cors = require('cors');

const options = {
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
};

app.use(express.json());
app.use(cors());
app.use(routesAuthentication);
app.use(routesTasks);

const PORT = process.env.PORT || 3000;
https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server running on https://localhost:${PORT}`);
});

module.exports = app;

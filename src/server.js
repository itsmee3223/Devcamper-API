const https = require('https');
const app = require('./app');

const PORT = process.env.PORT || 8000;
const server = https.createServer(app)


const startServer = async ()=> {
  server.listen(PORT, ()=> {
    console.log(`Listening on ${PORT}`);
  });
}

startServer()
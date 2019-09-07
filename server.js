#!/usr/bin/env node
const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// sound national assets
app.use('/js', express.static(path.join(__dirname, 'src/sound-national/src/js')));

app.get('/soundnational', (_, res) => {
  res.sendFile(path.join(__dirname, '/src/sound-national/dist/index.html'));
});

const server = http.createServer(app)

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  } else {
    console.log(`${error}`);
  }
};

const onListening = () => {
  console.log(`listening on port ${port}`);
};

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

const fs = require('fs');
const { pipeline } = require('stream/promises');
const { Transform } = require('stream');
const { redisClient } = require('../utils/cache');

exports.processLargeFile = async (req, res) => {
  try {
    const readStream = fs.createReadStream('./data/large-file.txt', {
      highWaterMark: 64 * 1024 // 64KB chunks
    });

    const transformStream = new Transform({
      transform(chunk, encoding, callback) {
        // Process chunk (example: uppercase all text)
        const processed = chunk.toString().toUpperCase();
        this.push(processed);
        callback();
      }
    });

    res.setHeader('Content-Type', 'text/plain');
    
    await pipeline(
      readStream,
      transformStream,
      res
    );
  } catch (err) {
    res.status(500).send('Error processing file');
  }
};
exports.streamOrders = async (req, res) => {
  try {
    const Order = require('../models/Order');
    res.setHeader('Content-Type', 'application/json');
    
    const cursor = Order.find().lean().cursor();
    
    res.write('[');
    let first = true;
    
    for await (const doc of cursor) {
      if (!first) res.write(',');
      first = false;
      res.write(JSON.stringify(doc));
    }
    
    res.write(']');
    res.end();
  } catch (err) {
    res.status(500).send('Error streaming orders');
  }
};
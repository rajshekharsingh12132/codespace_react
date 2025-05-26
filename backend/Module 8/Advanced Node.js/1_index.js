const { Transform } = require('stream');

// Add this to the pipeline before writableStream
const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    // Example: convert to uppercase
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

// Then update the pipeline:
await pipeline(
  readableStream,
  transformStream,
  writableStream
);
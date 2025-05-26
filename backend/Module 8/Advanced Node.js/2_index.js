const cluster = require('node:cluster');
const os = require('node:os');
const http = require('node:http');
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);
  
  // Get number of available CPU cores
  const cpuCount = os.availableParallelism?.() || os.cpus().length;
  console.log(`Launching ${cpuCount} worker processes`);

  // Create worker processes
  const workers = Array.from({ length: cpuCount }).map(() => cluster.fork());

  // Track worker restarts to prevent infinite loops
  const restartCounts = new Map();

  cluster.on('exit', (worker, code, signal) => {
    const restarts = (restartCounts.get(worker.id) || 0) + 1;
    restartCounts.set(worker.id, restarts);

    console.log(`Worker ${worker.process.pid} exited with code ${code} (restart #${restarts})`);

    if (restarts > 3) {
      console.error(`Worker ${worker.id} crashed too often, not restarting`);
      return;
    }

    if (!worker.exitedAfterDisconnect && code !== 0) {
      console.log(`Restarting worker ${worker.id}`);
      cluster.fork();
    }
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\nShutting down gracefully...');
    workers.forEach(w => w.disconnect());
    
    setTimeout(() => {
      console.log('Forcefully exiting');
      process.exit(1);
    }, 5000).unref();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

} else {
  // Worker process logic
  console.log(`Worker ${process.pid} started`);

  // Create HTTP server
  const server = http.createServer((req, res) => {
    // Simulate some work
    const start = Date.now();
    while (Date.now() - start < 100) {} // Block for 100ms
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Response from worker ${process.pid}\n`);
  });

  // Handle server errors
  server.on('error', (err) => {
    console.error(`Worker ${process.pid} server error:`, err);
    process.exit(1);
  });

  // Start server
  server.listen(8000, () => {
    console.log(`Worker ${process.pid} listening on port 8000`);
  });

  // Handle worker shutdown signals
  process.on('SIGTERM', () => {
    console.log(`Worker ${process.pid} received SIGTERM`);
    server.close(() => {
      process.exit(0);
    });
  });
}
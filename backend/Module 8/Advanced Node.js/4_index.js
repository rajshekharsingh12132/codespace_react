const cluster = require('cluster');
const http = require('http');
const os = require('os');
const assert = require('assert');
const { request } = require('http');

const numCPUs = 2; // Keep it 2 for simplicity in testing
const ports = Array.from({ length: numCPUs }, (_, i) => 3000 + i);

if (cluster.isMaster) {
  console.log(`👑 Master ${process.pid} is running`);

  // Fork workers and assign ports
  ports.forEach(port => {
    const worker = cluster.fork({ PORT: port });
    console.log(`🔧 Forked worker ${worker.process.pid} on port ${port}`);
  });

  cluster.on('online', (worker) => {
    console.log(`✅ Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`❌ Worker ${worker.process.pid} exited`);
    const port = worker.process.env.PORT;
    cluster.fork({ PORT: port });
  });

  // Inline unit testing after short delay
  setTimeout(() => {
    console.log('\n🧪 Running Inline Unit Tests');
    ports.forEach(port => {
      const options = {
        hostname: 'localhost',
        port: port,
        path: '/',
        method: 'GET'
      };

      const req = request(options, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            assert.strictEqual(res.statusCode, 200, `Port ${port}: Status code not 200`);
            assert.ok(data.includes(`on port ${port}`), `Port ${port}: Response incorrect`);
            console.log(`✅ Test passed for port ${port}`);
          } catch (err) {
            console.error(`❌ Test failed for port ${port}:`, err.message);
          }
        });
      });

      req.on('error', err => {
        console.error(`❌ Error testing port ${port}: ${err.message}`);
      });

      req.end();
    });
  }, 2000); // Allow time for servers to start

} else {
  const PORT = process.env.PORT || 3000;

  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Handled by worker ${process.pid} on port ${PORT}`);
  });

  server.listen(PORT, () => {
    console.log(`🚀 Worker ${process.pid} listening on port ${PORT}`);
  });
}

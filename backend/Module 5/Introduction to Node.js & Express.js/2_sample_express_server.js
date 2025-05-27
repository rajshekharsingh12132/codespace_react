// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export the app for testing
module.exports = app;

/* =======================
   Unit Tests with Mocha & Chai
   Run with: npx mocha server.js
========================== */
if (process.env.NODE_ENV === 'test' || require.main !== module) {
  const chai = require('chai');
  const chaiHttp = require('chai-http');
  const expect = chai.expect;

  chai.use(chaiHttp);

  describe('GET /', () => {
    it('should return Hello from Express!', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal('Hello from Express!');
          done();
        });
    });
  });
}

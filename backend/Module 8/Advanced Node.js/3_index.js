// Import the Redis client
const redis = require('redis');

// Create and connect a Redis client
const client = redis.createClient();

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

client.connect()
  .then(async () => {
    console.log('Connected to Redis');

    // Step 3: Store a key-value pair
    await client.set('greeting', 'Hello, Redis!');

    // Step 4: Retrieve the stored value
    const value = await client.get('greeting');
    console.log('Retrieved value:', value);

    // Step 5: Close the connection
    await client.quit();
    console.log('Redis connection closed');
  })
  .catch((err) => {
    console.error('Error connecting to Redis:', err);
  });

  const assert = require('assert');

(async () => {
  const redis = require('redis');
  const client = redis.createClient();

  client.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  try {
    await client.connect();

    const testKey = 'testKey';
    const testValue = 'testValue';

    await client.set(testKey, testValue);
    const retrievedValue = await client.get(testKey);

    // Assert that the retrieved value matches the stored value
    assert.strictEqual(retrievedValue, testValue, 'Retrieved value does not match stored value');

    console.log('✅ Inline test passed: Value stored and retrieved successfully');

    await client.quit();
  } catch (err) {
    console.error('❌ Inline test failed:', err);
  }
})();

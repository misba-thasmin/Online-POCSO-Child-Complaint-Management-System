const http = require('http');

const testRegister = () => {
  const data = JSON.stringify({
    name: "Test User",
    email: "test_new_api@example.com",
    password: "StrongPassword123!",
    phone: "1234567890",
    city: "Test City",
    question1: "Dog",
    question2: "John"
  });

  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, res => {
    console.log(`Register status: ${res.statusCode}`);
    res.on('data', d => process.stdout.write(d));
    res.on('end', () => {
        console.log('\n---');
        testLogin();
    });
  });

  req.on('error', error => console.error(error));
  req.write(data);
  req.end();
};

const testLogin = () => {
  const data = JSON.stringify({
    email: "test_new_api@example.com",
    password: "StrongPassword123!"
  });

  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, res => {
    console.log(`Login status: ${res.statusCode}`);
    res.on('data', d => process.stdout.write(d));
  });

  req.on('error', error => console.error(error));
  req.write(data);
  req.end();
};

testRegister();

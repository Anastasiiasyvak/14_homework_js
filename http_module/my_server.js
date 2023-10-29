const http = require('http');
const fs = require('fs');

const port = 3000;

const server = http.createServer(handleRequest);

server.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});

function handleRequest(req, res) {
  if (req.method === 'GET' && req.url === '/users') {
    const users = getUsers();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else if (req.method === 'GET' && req.url.startsWith('/users/')) {
    const userId = parseInt(req.url.split('/').pop());
    const user = getUserById(userId);
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('User not found');
    }
  } else if (req.method === 'POST' && req.url === '/users') {
    let requestBody = '';
    req.on('data', (chunk) => {
      requestBody += chunk.toString();
    });

    req.on('end', () => {
      const userData = JSON.parse(requestBody);
      const newUser = createUser(userData);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
  } else if (req.method === 'PUT' && req.url.startsWith('/users/')) {
    const userId = parseInt(req.url.split('/').pop());

    let requestBody = '';
    req.on('data', (chunk) => {
      requestBody += chunk.toString();
    });

    req.on('end', () => {
      const updatedUserData = JSON.parse(requestBody);
      const updatedUser = updateUserById(userId, updatedUserData);
      if (updatedUser) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedUser));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('User not found');
      }
    });
  } else if (req.method === 'DELETE' && req.url.startsWith('/users/')) {
    const userId = parseInt(req.url.split('/').pop());
    const deleted = deleteUserById(userId);
    if (deleted) {
      res.writeHead(204); 
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('User not found');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
}

function getUsers() {
  const usersData = fs.readFileSync('users.json', 'utf8');
  const users = JSON.parse(usersData);
  return users;
}

function getUserById(id) {
  const usersData = fs.readFileSync('users.json', 'utf8');
  const users = JSON.parse(usersData);
  const user = users.find((u) => u.id === id);
  return user;
}

function createUser(userData) {
  const usersData = fs.readFileSync('users.json', 'utf8');
  const users = JSON.parse(usersData);

  const maxId = Math.max(...users.map((u) => u.id));
  const newUserId = maxId + 1;

  const newUser = { id: newUserId, ...userData };
  users.push(newUser);

  fs.writeFileSync('users.json', JSON.stringify(users, null, 2), 'utf8');

  return newUser;
}

function updateUserById(id, updatedUserData) {
  const usersData = fs.readFileSync('users.json', 'utf8');
  const users = JSON.parse(usersData);

  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex !== -1) {
    users[userIndex] = { id, ...updatedUserData };
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2), 'utf8');
    return users[userIndex];
  } else {
    return null;
  }
}

function deleteUserById(id) {
  const usersData = fs.readFileSync('users.json', 'utf8');
  const users = JSON.parse(usersData);

  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2), 'utf8');
    return true; 
  } else {
    return false; 
  }
}

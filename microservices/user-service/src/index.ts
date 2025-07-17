import express from 'express';

const app = express();
const PORT = process.env.PORT || 4001;

app.get('/api/users/hello', (_req, res) => {
  res.json({ message: 'Hello from User Service' });
});

app.listen(PORT, () => {
  console.log(`User service listening on port ${PORT}`);
});

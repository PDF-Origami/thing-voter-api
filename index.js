import express from 'express';
import entity from './routes/entity.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/entity', entity);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

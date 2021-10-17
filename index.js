import express from 'express';
import entity from './routes/entity.js';
import set from './routes/set.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
app.use('/entity', entity);
app.use('/set', set);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

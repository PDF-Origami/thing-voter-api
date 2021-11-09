import express from 'express';
import entityRoutes from './routes/entity.js';
import setRoutes from './routes/set.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
// TODO: create generic controller implementing shared functions?
app.use('/entities', entityRoutes);
app.use('/sets', setRoutes);

app.listen(port);

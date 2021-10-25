import express from 'express';
import entityRoutes from './routes/entity.js';
import setRoutes from './routes/set.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
app.use('/entity', entityRoutes);
app.use('/set', setRoutes);

app.listen(port);

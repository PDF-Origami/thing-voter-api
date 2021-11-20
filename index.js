import express from 'express';
import './loadenv.js';
import setRoutes from './routes/set.js';
import entityRoutes from './routes/entity.js';
import actionroutes from './routes/action.js';

const app = express();
const port = 5555;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
// TODO: create generic controller implementing shared functions?
app.use('/sets', setRoutes);
app.use('/entities', entityRoutes);
app.use('/actions', actionroutes);
app.use((err, req, res, next) => {
  res.status(500).send({ error: 'Internal server error' });
});

console.log(`App listening at localhost:${port}`);
app.listen(port);

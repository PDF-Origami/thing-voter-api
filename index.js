import express from 'express';
import setRoutes from './routes/set.js';
import entityRoutes from './routes/entity.js';
import actionroutes from './routes/action.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
// TODO: create generic controller implementing shared functions?
app.use('/sets', setRoutes);
app.use('/entities', entityRoutes);
app.use('/actions', actionroutes);

app.listen(port);

import express, { Express } from 'express';
import bodyParser from 'body-parser';
import auth from './routes/auth/auth.route';

const app: Express = express();

app.use(bodyParser.json());
app.use('/api/auth', auth);

export default app;
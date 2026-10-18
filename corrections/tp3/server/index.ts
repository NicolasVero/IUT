import express from 'express';
import cors from 'cors';
import { pokemonRouter } from './routes/pokemon.routes';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  return response.sendStatus(200);
});

app.get('/api/about', (_request, response) => {
  return response.json({ name: 'Pokemon API', version: 1 });
});

app.use('/api/pokemons', pokemonRouter);

app.listen(port, () => {
  console.log(`API available at http://localhost:${port}`);
});

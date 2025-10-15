import { env } from './config/env';
import { app } from './app';

const port = env.PORT;

app.listen(port, () => {
  console.log(`🚀 Backend ready on http://localhost:${port}`);
});

import express from 'express';
import cors from 'cors';
import routes from './src/routes';

class App {
  public server = express();

  constructor() {
    this.middleware();
  }

  middleware() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(routes);
  }
}

export default new App().server;

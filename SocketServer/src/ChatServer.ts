import * as express from 'express';
import * as socketIo from 'socket.io';
import { ChatEvent } from './constants';
import { ChatMessage } from './types';
import { createServer, Server } from 'http';

import * as fs from 'fs';
import * as path from 'path';
var cors = require('cors');

export class ChatServer {
  public static readonly PORT: number = 3001;
  private _app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;
  public privateKey : any;
  public certificate : any;
  public credentials : any;
  constructor () {
    this._app = express();
    this.port = process.env.PORT || ChatServer.PORT;
    this._app.use(cors());
    this._app.options('*', cors());

    // this.privateKey  = fs.readFileSync(path.join(__dirname, "/cert/knockout.key"), 'utf8');
    // this.certificate = fs.readFileSync(path.join(__dirname, "/cert/knockout.crt"), 'utf8');

    // this.credentials = {key: this.privateKey, cert: this.certificate};

    this.server = createServer(this._app);
    this.initSocket();
    this.listen();
  }

  private initSocket (): void {
    this.io = socketIo(this.server);
  }

  private listen (): void {
    this.server.listen(this.port, () => {
      console.log('Running https server on port %s', this.port);
    });

    this.io.on(ChatEvent.CONNECT, (socket: any) => {
      console.log('Connected client on port %s.', this.port);

      socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
        console.log('[server](message): %s', JSON.stringify(m));
        this.io.emit('message', m);
      });

      socket.on(ChatEvent.NEW_REQUEST_NOTIFICATION, (request_data: any) => {
        console.log('[server](message): %s', JSON.stringify(request_data));
        this.io.emit('service_request_notification', request_data);
      });

      socket.on(ChatEvent.DISCONNECT, () => {
        console.log('Client disconnected');
      });
    });
  }

  get app (): express.Application {
    return this._app;
  }
}

import {Injectable} from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Injectable()
export class WebsocketService {
  constructor() {
    this._connect();
  }

  webSocketEndPoint: string = 'http://localhost:5001/ws';
  topic: string = '/topic/greetings';
  stompClient: any;


  _connect() {
    console.log('Initialize WebSocket Connection');
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame) {
      _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
        _this.onMessageReceived(sdkEvent);
      });
      //_this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);
  };

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log('errorCallBack -> ' + error)
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  _send(message) {
    this.stompClient.send('/app/hello', {}, JSON.stringify(message));
  }
  _joinBroadcast(message) {
    this.stompClient.send('/app/join', {}, JSON.stringify(message));
  }

  onMessageReceived(message) {
    console.log(message.body)
  }

}

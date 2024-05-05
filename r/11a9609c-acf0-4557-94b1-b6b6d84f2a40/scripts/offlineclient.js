"use strict";

class OfflineClientInfo {
  constructor() {
    this._broadcastChannel =
      typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel("offline")
        : null;
    this._queuedMessages = [];
    this._onMessageCallback = null;

    if (this._broadcastChannel) {
      this._broadcastChannel.onmessage = this._OnBroadcastChannelMessage.bind(this);
    }
  }

  _OnBroadcastChannelMessage(event) {
    if (this._onMessageCallback) {
      this._onMessageCallback(event);
    } else {
      this._queuedMessages.push(event);
    }
  }

  setMessageCallback(callback) {
    this._onMessageCallback = callback;

    for (const event of this._queuedMessages) {
      this._onMessageCallback(event);
    }

    this._queuedMessages.length = 0;
  }
}

window.OfflineClientInfo = new OfflineClientInfo();


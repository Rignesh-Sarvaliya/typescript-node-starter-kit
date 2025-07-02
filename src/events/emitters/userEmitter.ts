import { EventEmitter } from "events";

export const userEmitter = new EventEmitter();

// You can listen to: userEmitter.on("user.registered", callback)

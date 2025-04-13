import { EventEmitter } from "events";

export const userEmitter = new EventEmitter();
userEmitter.emit("otp.sent", { email, otp });
userEmitter.emit("password.reset_link.sent", { email, token });
userEmitter.emit("user.passwordChanged", { userId });

// You can listen to: userEmitter.on("user.registered", callback)

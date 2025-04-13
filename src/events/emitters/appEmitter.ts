import { EventEmitter } from "events";

export const appEmitter = new EventEmitter();

// Event names
export const APP_EVENTS = {
  USER_REGISTERED: "user.registered",
  ADMIN_LOGGED_IN: "admin.loggedIn",
  NOTIFICATION_CREATED: "notification.created",
};

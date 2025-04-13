import { appEmitter, APP_EVENTS } from "../emitters/appEmitter";

appEmitter.on(APP_EVENTS.ADMIN_LOGGED_IN, (payload) => {
  console.log("🔐 Admin logged in:", payload.email);
  // Track login time, security log, etc.
});

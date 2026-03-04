import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import { ENV } from "./env.js";

// initialize Arcjet with security rules
export const aj = arcjet({
  key: ENV.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    // shield protects your app from common attacks e.g. SQL injection, XSS, CSRF attacks
    shield({ mode: ENV.NODE_ENV === "production" ? "LIVE" : "DRY_RUN" }),

    // bot detection - block all bots except search engines
    detectBot({
      mode: ENV.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:MONITOR", // Allow monitoring bots
        "CATEGORY:PREVIEW", // Allow social media preview bots
        "CATEGORY:TOOL",    // Allow tools like Android emulators/Expo Go
      ],
    }),

    // rate limiting with token bucket algorithm
    tokenBucket({
      mode: ENV.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
      refillRate: 15, // tokens added per interval (increased from 10)
      interval: 10, // interval in seconds
      capacity: 30, // maximum tokens in bucket (increased from 15)
    }),
  ],
});
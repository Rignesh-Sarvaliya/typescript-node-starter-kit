import cors from "cors";

const corsConfig = cors({
  origin: "*", // Allow all origins; adjust as needed for production
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

export default corsConfig;

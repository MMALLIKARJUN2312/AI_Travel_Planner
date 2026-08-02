process.env.NODE_ENV = "test";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/test-placeholder";
process.env.JWT_ACCESS_SECRET = "test-access-secret-do-not-use-in-prod-0000";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-do-not-use-in-prod-0000";
process.env.ACCESS_TOKEN_EXPIRES_IN = "15m";
process.env.REFRESH_TOKEN_EXPIRES_IN = "7d";
// Force the mock AI provider so tests never hit the real Gemini API, even
// though dotenv.config() would otherwise backfill GEMINI_API_KEY from the
// real backend/.env for any var not already set here.
process.env.AI_PROVIDER = "mock";
process.env.GEMINI_API_KEY = "";

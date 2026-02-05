const { z } = require("zod");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Define Zod schema for environment variables
const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/).transform(Number).default("5000"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters for security"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

// Validate environment variables at boot time
let config;

try {
  config = envSchema.parse({
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  });

  console.log("✅ Environment configuration validated successfully");
} catch (error) {
  console.error("❌ Invalid environment configuration:");
  if (error instanceof z.ZodError) {
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join(".")}: ${err.message}`);
    });
  }
  console.error("\nPlease check your .env file and fix the above errors.");
  process.exit(1);
}

// Export validated config (never use process.env in controllers)
module.exports = config;

import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "testing", "production"]),
	LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "fatal"]),
	API_HOST: z.string(),
	API_PORT: z.string(),
	ELEVENLABS_API_KEY: z.string(),
	OPENAI_API_KEY: z.string(),
	SUPABASE_URL: z.string(),
	SUPABASE_SERVICE_ROLE_KEY: z.string(),
});

type EnvConfig = z.infer<typeof envSchema>;

function loadEnvConfig(): EnvConfig {
	const nodeEnv = process.env.NODE_ENV || "development";
	const envFileName = nodeEnv === "testing" ? ".env.test" : ".env";
	const envPath = path.join(__dirname, "..", "..", envFileName);
	
	const result = dotenv.config({ path: envPath });

	if (result.error) {
		throw new Error(
			`Failed to load ${envFileName} file from path ${envPath}: ${result.error.message}`,
		);
	}

	try {
		const config = envSchema.parse(process.env);
		return config;
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error(
				`Config validation error: ${error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
			);
		}
		throw error;
	}
}

export const env = loadEnvConfig();

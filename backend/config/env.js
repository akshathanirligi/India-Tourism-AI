const requiredInProduction = ["MONGO_URI", "JWT_SECRET", "CLIENT_ORIGIN"];
const developmentDefaults = {
  MONGO_URI: "mongodb://127.0.0.1:27017/IndiaTourismDB",
  JWT_SECRET: "india-tourism-ai-development-secret-change-before-production",
  CLIENT_ORIGIN: "https://india-tourism-ai.vercel.app,http://localhost:5173,http://127.0.0.1:5173,http://localhost:5177,http://127.0.0.1:5177",
};

function validateEnvironment() {
  const missing = requiredInProduction.filter((name) => !process.env[name]);
  if (process.env.NODE_ENV === "production" && missing.length) throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  if (process.env.NODE_ENV !== "production") {
    for (const [name, value] of Object.entries(developmentDefaults)) process.env[name] ||= value;
  }
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be configured.");
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET must be configured.");
}

module.exports = { validateEnvironment };

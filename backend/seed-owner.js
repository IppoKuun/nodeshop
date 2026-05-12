import mongoose from "mongoose";
import config from "./env.js";
import User from "./models/User.js";

const username = process.env.SEED_OWNER_USERNAME?.trim().toLowerCase();
const password = process.env.SEED_OWNER_PASSWORD;
const displayName = process.env.SEED_OWNER_DISPLAY_NAME?.trim() || "Owner";
const mongoUrl = process.env.MONGO_Url || config.MONGO.Url;

async function main() {
  if (!mongoUrl) throw new Error("[seed:owner] MONGO_Url manquant");
  if (!username) throw new Error("[seed:owner] SEED_OWNER_USERNAME manquant");
  if (!password) throw new Error("[seed:owner] SEED_OWNER_PASSWORD manquant");

  await mongoose.connect(mongoUrl);

  const existing = await User.findOne({ username });
  if (existing) {
    if (existing.role !== "owner") {
      existing.role = "owner";
      existing.displayName = existing.displayName || displayName;
      await existing.save();
      console.log(`[seed:owner] utilisateur existant promu owner: ${username}`);
    } else {
      console.log(`[seed:owner] owner deja existant: ${username}`);
    }
    return;
  }

  const owner = new User({
    username,
    role: "owner",
    displayName,
    status: "active",
  });

  await owner.setPassword(password);
  await owner.save();

  console.log(`[seed:owner] owner cree: ${username}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

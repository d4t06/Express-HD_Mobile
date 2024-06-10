import sequelize from "./src/config/sequelize";

export default async function connectDB() {
   try {
      console.log("Connecting to db...");
      await sequelize.authenticate();
      console.log("Connected to db");
   } catch (error) {
      console.error("Unable to connect to the database:", error);
   }
}

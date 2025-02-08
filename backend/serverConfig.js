import "dotenv/config";

const serverConfig = {
  port: process.env.PORT || 4002,
  dburl: process.env.DB_URL,
  frontendpath: "./frontend/dist",
};
export default serverConfig;

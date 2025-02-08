import { connect } from "mongoose";
import serverConfig from "./serverConfig.js";

async function dbConnect() {
  try {
    await connect(serverConfig.dburl),
      {
        timeoutMS: 10000,
      };
    console.log("dbconnect sucessfully");
  } catch (error) {
    throw error;
  }
}

export default dbConnect;

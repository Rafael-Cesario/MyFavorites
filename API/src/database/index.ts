import { connect } from "mongoose";
import "dotenv/config";

const MongoDB = () => {
	connect(process.env.DBURL!, () => console.log("DataBase is connect"));
};

MongoDB();

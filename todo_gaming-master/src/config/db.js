import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://gamingUser:hola1234@todogaming.huxfu4r.mongodb.net/tienda?appName=TodoGaming"
        );

        console.log("Base de datos conectada (Atlas)");
    } catch (error) {
        console.error("Error al conectar la DB", error);
        process.exit(1);
    }
};

export default connectDB;

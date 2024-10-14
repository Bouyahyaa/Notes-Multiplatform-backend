import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js";

mongoose.Promise = global.Promise;

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server Running on Port: http://localhost:${PORT}`);
});

app.use("/users", userRoutes);


app.get('/', (req, res) => {
    res.send('KOTLIN-DB')
})

const CONNECTION_URL = "mongodb+srv://bilelJs:Bilelbilel200@cluster0.0dt5b.mongodb.net/";
mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
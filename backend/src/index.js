import app from "./app.js";

app.listen(process.env.PORT, () => {
    console.log(`⚙️  Server is Running at PORT : http://localhost:${process.env.PORT}`);
});

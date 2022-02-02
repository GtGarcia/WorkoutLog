require("dotenv").config();
const Express = require("express");
const app = Express();
const dbConnection = require("./db");
const middleware = require("./middleware");

app.use(Express.json());

const controllers = require("./controllers");

app.use(middleware.CORS)
app.use("/log", controllers.workoutController);

// app.use(require("./middleware/validate-jwt"));
app.use("/user", controllers.userController);

dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {
    app.listen(6000, () => {
        console.log(`[Server]: App is listening on 6000.`);
    });
})
.catch((err) => {
    console.log(`[Server]: Server crashed. Error = ${err}`);
});


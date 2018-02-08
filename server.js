const express = require("express");
const http = require("http");
const path = require("path");

const app = express();

app.use("/scripts", express.static(path.join(__dirname, "node_modules")));
app.use("/app", express.static(path.join(__dirname, "build", "app")));
app.use("/css", express.static(path.join(__dirname, "docs", "css")));
app.use("/js", express.static(path.join(__dirname, "docs", "js")));

app.set("port", process.env.PORT || 3000);

app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "docs", "./html/index.html"));
});

const server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Example app is listening on port ' + app.get('port'));
});
const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const { mongoConnect } = require("./helpers/db/dbConnection");
const { PORT } = process.env || 3000;

const startServer = async () => {
  await mongoConnect();
  server.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
  });
};

startServer();

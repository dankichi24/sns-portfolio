const app = require("./server");
const serverless = require("serverless-http");

// Vercel用にExpressをServerless化
module.exports = serverless(app);

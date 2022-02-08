require('dotenv').config();
const path = require("path");

module.exports = {
    isProd: process.env.NODE_ENV === "production",
    hmrEnabled: process.env.NODE_ENV !== "production" && !process.env.NO_HMR,
    distFolder: path.resolve(__dirname, "./dist"),
    srcFolder: path.resolve(__dirname, "./src/resources"),
    publicPath: "/assets",
    wdsPort: 5505,
};
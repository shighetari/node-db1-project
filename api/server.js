const express = require("express");

const db = require("../data/dbConfig.js");

const accRouter = require('../Accounts/accountsRouter')

const server = express();

server.use(express.json());

server.use("/api/accounts", accRouter)

server.get("/", (req, res) => {
    res.status(200).json({ api: "up" });
  });



module.exports = server;

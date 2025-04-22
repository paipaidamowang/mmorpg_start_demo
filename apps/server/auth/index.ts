import express from "express";
import cors from "cors";
import mysql from "mysql";
import dayjs from "dayjs";
import { createHash } from "crypto";
import bodyParser from "body-parser";
// @ts-ignore
import Crypt from 'node-jsencrypt';
import { PrivateKey } from "../common";

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "mmo_db",
});


const crypt = new Crypt();
crypt.setKey(PrivateKey);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/register", function (req, res) {
  console.log(req.body);
  let { account, password } = req.body;
  account = crypt.decrypt(account);
  password = crypt.decrypt(password);


  console.log(account, password);

  const hash = createHash("md5");

  hash.update(password);
  const passwordHsh = hash.digest("hex");

  connection.query(
    `INSERT INTO user (account, password, created_time) VALUES (?, ?, ?)`,
    [account, passwordHsh, dayjs().format('YYYY-MM-DD HH:mm:ss')],
    function (error, results, fields) {
      if (error) {
        console.log(error);
        return;
      }
      console.log(results);
    }
  );

  res.json({});
});

app.listen(3000, () => {
  console.log("auth 服务启动成功");
});


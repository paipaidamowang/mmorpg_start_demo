import express from "express";
import cors from "cors";
import mysql from "mysql";
import dayjs from "dayjs";
import { createHash } from "crypto";
import { v4 as uuidv4 } from 'uuid';
import bodyParser from "body-parser";
// @ts-ignore
import Crypt from 'node-jsencrypt';
import { PrivateKey } from "../common";

const cache = new Map();

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

app.post("/login", function (req, res) {
  console.log(req.body);

  let { account, password } = req.body;
  account = crypt.decrypt(account);
  password = crypt.decrypt(password);

  console.log(account, password);

  const hash = createHash("md5");
  hash.update(password);
  const passwordHsh = hash.digest("hex");

  connection.query(
    `SELECT * FROM user WHERE account = ? AND password = ?`,
    [account, passwordHsh],
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "数据库错误" });
        return;
      }
      console.log(results);
      if (results.length > 0) {
        const token = uuidv4();
        cache.set(token, account);
        console.log(cache);
        res.json({ token });
      } else {
        res.status(401).json({ error: "账号或密码错误" });
      }
    }
  );
});

app.listen(3000, () => {
  console.log("auth 服务启动成功");
});


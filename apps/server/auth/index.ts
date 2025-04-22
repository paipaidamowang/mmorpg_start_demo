import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/register", function (req, res){
  console.log(req.body);
  
  res.json({});
});

app.listen(3000, () => {
  console.log("auth 服务启动成功");
});


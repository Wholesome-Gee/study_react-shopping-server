const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3000; // 또는 원하는 포트 번호

// 프로젝트내 build폴더를 static폴더로 사용한다는 설정
app.use(express.static(path.join(__dirname, "client", "build")));
// 클라이언트로부터 받은 JSON을 해석하여 req.body에 객체 형태로 담아줌
app.use(express.json());
// SOP(동일출처정책)을 피할 수 있도록 CORS 사용
app.use(cors());

// 메인 url로 요청 시, 프로젝트 내 build폴더 내 index.html을 보여줌
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html", "build", "index.html"));
});

/*
/product-data로 요청 시, data를 보내주는 방법
app.get("/product-data", (req, res) => {
  res.json({ name: "black shoes" });
  // res.json( arr / obj를 넣으면 된다. );
});
*/

/*
routing을 react에서 해줄 땐 아래 코드로 대체(맨 아래에 작성)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'/react_server-test/build/index.html'));
});
*/

app.listen(port, () => {
  console.log(`✅Server on : http://localhost:${port}`);
});

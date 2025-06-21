const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const { User } = require("./models/User");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();
const port = 3000; // 또는 원하는 포트 번호

// 🔻mongoose로 server와 mongodb cluster 연결
mongoose
  .connect(
    "mongodb+srv://wholesome-gee:wlfyd1564@freecluster.0ds7963.mongodb.net/shoppingmall?retryWrites=true&w=majority&appName=FreeCluster" // db주소(환경변수등록)
  )
  .then(() => console.log("✅ db 연결"))
  .catch((err) => console.log("❌ db 연결 실패 : ", err));

// 🔻react build폴더를 static폴더로 사용한다는 설정
app.use(express.static(path.join(__dirname, "client", "build")));

// 🔻react로부터 받은 JSON을 해석하여 req.body에 객체 형태로 담아줌
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔻SOP(동일출처정책)을 피할 수 있도록 CORS 사용
app.use(cors());

// 🔻session 설정
app.use(
  session({
    secret: "process.env.SESSION_SECRET", // 세션 보안키(환경변수등록)
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://wholesome-gee:wlfyd1564@freecluster.0ds7963.mongodb.net/shoppingmall", // 세션 저장 db(환경변수등록)
    }),
    cookie: {
      maxAge: 86400000 * 1, // 세션 유효기간 1일
    },
  })
);

// 🔻get 설정
app.get("/session", (req, res) => {
  if (req.session && req.session.loggedIn) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("logout");
});
// 메인 url로 요청 시, 프로젝트 내 build폴더 내 index.html을 보여줌
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html", "build", "index.html"));
});

app.post("/join", async (req, res) => {
  const { name, email, password } = req.body;
  // 이미 등록된 email인지 확인
  const exist = await User.exists({ email });
  if (exist) {
    return res.send("이미 등록된 email입니다.");
  }
  try {
    await User.create({ name, email, password });
    return res.send("success");
  } catch (error) {
    return res.send("회원가입에 실패하였습니다2.");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, socialLogin: false });
  if (!user) {
    const error = { type: "emailError", message: "잘못된 email입니다." };
    return res.send(error);
  }
  if (user.password !== password) {
    const error = { type: "passwordError", message: "잘못된 password입니다." };
    return res.send(error);
  }
  req.session.loggedIn = true;
  req.session.user = user;
  console.log(req.session.user);
  return res.send({ type: "success", message: "로그인 성공", session: req.session });
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
  console.log(`✅ Server on : http://localhost:${port}`);
});

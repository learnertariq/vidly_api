const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function run() {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash("1234", salt);

  const token = jwt.sign({ name: "tariq" }, "jwtPrivateKey");
  console.log(token);

  const user = jwt.verify(token, "jwtPrivateKey");
  console.log(user);

  const result = await bcrypt.compare("12345", hash);
  console.log(result);
}
run();

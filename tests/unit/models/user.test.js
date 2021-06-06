const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

const { User } = require("../../../models/user");

describe("user.generateAuthToken", () => {
  it("should return a valid json web token", () => {
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };

    const token = new User(user).generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

    expect(decoded).toMatchObject(user);
  });
});

const auth = require("../../../middlewares/auth");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  it("should populate req.user with payload of a valid JWT", () => {
    const obj = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(obj).generateAuthToken();

    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toHaveProperty("isAdmin", true);
    expect(req.user).toHaveProperty("_id", obj._id);
    expect(req.user).toMatchObject(obj);
  });
});

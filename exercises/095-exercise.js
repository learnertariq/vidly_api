const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/mongo-exercises", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => console.log("Connected to MongoDB..... "))
  .catch((err) => console.log("Error connecting to MongoDB ", err));

const courseSchema = new mongoose.Schema(
  {
    author: String,
    date: { type: Date, default: Date.now() },
    isPublished: Boolean,
    name: String,
    price: Number,
    tags: [String],
  },
  { strict: false }
);

const Course = mongoose.model("Course", courseSchema);

async function getCourses1() {
  const courses = await Course.find({ isPublished: true, tags: "backend" })
    .sort({ name: 1 })
    .select({ name: 1, author: 1 });

  console.log(courses);
}

async function getCourses2() {
  const courses = await Course.find({
    isPublished: true,
    tags: { $in: ["frontend", "backend"] },
  })
    .sort({ price: -1 })
    .select({ name: 1, author: 1 });

  console.log(courses);
}

async function getCourses3() {
  const courses = await Course.find({ isPublished: true }).or([
    { price: { $gte: 15 } },
    { name: /.*by.*/ },
  ]);

  console.log(courses);
}

getCourses3();

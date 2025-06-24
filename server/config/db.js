const mongoose  = require('mongoose')

const dbConfig = async() => {
  try {
    const config = await mongoose.connect("mongodb+srv://hishammpsn:90CD55uZ2YuvRf4H@cluster0.xcjlw6s.mongodb.net/");
    console.log("Mongo Connected Successfully");
  } catch (error) {
    console.log("Mongo Connection Failed",error);
    process.exit(1);
  }
};
module.exports = dbConfig
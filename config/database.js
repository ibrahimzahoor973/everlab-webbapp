import mongoose from 'mongoose';

const { MONGO_URL } = process.env;

mongoose.connect(MONGO_URL)
  .then(async (db) => {
    console.log('MongoDB Connected');

  })
  .catch(err => console.log('MongoDB::', err));
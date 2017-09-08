import settings from '../settings';
import mongoose from 'mongoose';

console.log("Connecting to MongoDB");
mongoose.connect(settings.mongoUri);

import mongoose from "mongoose";
import { activitySchema } from "./activity.schema.js";

export const itineraryDaySchema = new mongoose.Schema({
    dayNumber : Number,
    title : String,
    morning : [activitySchema],
    afternoon : [activitySchema],
    evening : [activitySchema],
    tips : [String],
    estimatedCost : Number,
})
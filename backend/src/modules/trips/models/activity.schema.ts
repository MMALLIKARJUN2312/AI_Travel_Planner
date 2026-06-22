import mongoose from "mongoose";

export const activitySchema = new mongoose.Schema({
    title : String,
    description : String,
    duration : String,
    estimatedCost : Number
},
    {
        _id : true
    }
)
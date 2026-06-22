import mongoose from "mongoose";

export const budgetEstimate = new mongoose.Schema({
    flights : Number,
    accommodation : Number,
    food : Number,
    transportation : Number,
    activities : Number, 
    total : Number,
    confidenceLevel : Number
},
    {
        _id : false
    }
)
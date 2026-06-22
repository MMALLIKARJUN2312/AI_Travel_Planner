import mongoose from "mongoose";

export const hotelSchema = new mongoose.Schema({
    name : String,
    rating : Number,
    priceRange : String,
    description : String 
},
    {
        _id : false
    }
)
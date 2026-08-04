import mongoose from "mongoose";

import { itineraryDaySchema } from "./itinerary-day.schema.js";
import { budgetEstimateSchema } from "./budget-estimate.schema.js";
import { hotelSchema } from "./hotel.schema.js";
import { riskAssessmentSchema } from "./risk-assessment.schema.js";

export const tripSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        index : true
    },
    destination : {
        type : String,
        required : true,
        trim : true
    },
    originCity : {
        type : String,
        required : true,
        trim : true
    },
    numberOfDays : {
        type : Number,
        required : true,
        min : 1
    },
    budgetType : {
        type : String,
        required : true,
        trim : true
    },
    currency : {
        type : String,
        required : true,
        trim : true
    },
    interests : [{
        type : String,
        trim : true,
    }],

    itinerary : [itineraryDaySchema],
    budgetEstimate : budgetEstimateSchema,
    hotelSuggestions : [hotelSchema],
    riskAssessment : riskAssessmentSchema,
},
    {
        timestamps : true,
        versionKey : false,
    },
);

tripSchema.index({
    userId : 1,
    createdAt : -1
});

tripSchema.index({
    destination : 1,
});

export const TripModel = mongoose.model("Trip", tripSchema);
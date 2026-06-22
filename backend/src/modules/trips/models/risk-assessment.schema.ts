import mongoose from "mongoose";
import { RiskLevel } from "../types/risk-level.enum.js";

export const riskAssessmentSchema = new mongoose.Schema({
    riskScore : Number,
    riskLevel : {
        type : String,
        enum : Object.values(RiskLevel)
    },
    recommendations : [String],
    alternativeActivities : [String]
},
    {
        _id : false
    }
)
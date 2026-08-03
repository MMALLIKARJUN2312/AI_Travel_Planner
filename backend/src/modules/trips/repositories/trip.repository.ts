import { TripModel } from "../models/trip.model.js";
import { CreateTripDto } from "../schemas/create-trip.schema.js";
import { UpdateTripDto } from "../schemas/update-trip.schema.js";

export class TripRepository {
    async create(data : CreateTripDto & {userId : string}) {
        return TripModel.create(data);
    }

    async findAllByUserId(userId : string) {
        return TripModel.find({userId}).sort({createdAt : -1});
    }

    async findByIdAndUserId(tripId : string, userId : string) {
        return TripModel.findOne({_id : tripId, userId})
    }

    async updateByIdAndUserId(tripId : string, userId : string, data : UpdateTripDto) {
        return TripModel.findOneAndUpdate({_id : tripId, userId}, data, {returnDocument: "after"})
    }

    async deleteByIdAndUserId(tripId : string, userId : string) {
        return TripModel.findOneAndDelete({_id : tripId, userId})
    }
}                                                                                                   
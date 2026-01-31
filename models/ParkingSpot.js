const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
        address: {
            type: String
        }
    },
    capacity: {
        type: Number,
        required: true,
        min: 0
    },
    pricePerHour: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['available', 'limited', 'full'],
        default: 'available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create 2dsphere index for geospatial queries
parkingSpotSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ParkingSpot', parkingSpotSchema);

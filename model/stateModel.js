const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({

    name: { 
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    population: {
        type: Number,
        required: true,
        trim: true
    },
    area: { 
        type: Number, 
        required: true,
        trim: true
    }, // in sq km
    capital: { 
        type: String,
        required: true 
    },
    climate: { 
        type: String,
        required: true 
    },
}, { timestamps: true });

module.exports = mongoose.model('states', stateSchema);
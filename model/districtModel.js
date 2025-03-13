const mongoose = require('mongoose');
const districtSchema = new mongoose.Schema({
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
    state_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'states',
        required: true,
        trim: true
    } // Foreign key reference to State
}, { timestamps: true });

module.exports = mongoose.model('district', districtSchema);
// filepath: c:\Users\svcs\bots_planet\backend\models\BotModel.js
import mongoose from 'mongoose';

const botSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    trial: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('bots', botSchema, 'bots');
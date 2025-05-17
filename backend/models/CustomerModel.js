import mongoose from 'mongoose';


const customerSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        unique: true
    },
    orgName: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    orgSize: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
})


export default mongoose.model("customers", customerSchema, "customers");
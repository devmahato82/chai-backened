import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
    {
        subscriber: {
            type :mongoose.Schema.Types.ObjectId, // one who is subscribing
            ref: 'User'
        }, 
        channel: {
            type :mongoose.Schema.Types.ObjectId, // one to whom is subscriber is subscribing
            ref: 'User'
        }

    }, { timeStamps: true }
)

export const Subscription = mongoose.model('Subription', subscriptionSchema)
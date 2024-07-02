const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientName: { type: String, required: true },
    address: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    proofOfTransfer: { type: String },
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            size: { type: String, required: true },
            title: { type: String, required: true }
        }
    ],
    status: { type: String, default: 'Completed' },
    completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', HistorySchema);

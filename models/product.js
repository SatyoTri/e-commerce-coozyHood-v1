const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productSchema = new schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
    type: String,
    required: true
  },
    image: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    sizes: {
        type: [String], 
        required: true
    }
    
});

module.exports = mongoose.model('Product', productSchema);

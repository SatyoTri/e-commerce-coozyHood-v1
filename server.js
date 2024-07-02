const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/product');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/auth')
const cartRoutes = require('./routes/cart')
const checkoutRoute = require('./routes/order')

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/order', checkoutRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/',(res,req)=>{
    res.send("Hello World");
})

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

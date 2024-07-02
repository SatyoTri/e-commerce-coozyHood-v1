const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username : {
        type: String,
        required:true 
    }, 
  email: { 
        type: String, 
        required: true, 
        unique: true 
},
  password: { 
        type: String, 
        required: true 
},
  role: { 
        type: Number, 
        default: 0 
},
cart: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
            size: { type: String, required: true },
        }
    ] 
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

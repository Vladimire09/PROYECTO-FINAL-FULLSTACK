const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['user', 'admin'], default: 'user' },
    cart:     { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }], default: [] },
    wishlist: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }], default: [] }
});

module.exports = mongoose.model('User', UserSchema);


const mongoose = require('mongoose');

const jerseySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    minlength: 3, 
    maxlength: 100 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0,
    set: v => parseFloat(v.toFixed(2)) // Ensure price is always two decimal places
  },
  size: { 
    type: String, 
    required: true,
    enum: ["S", "M", "L", "XL"] // Define acceptable sizes
  },
  description: { 
    type: String, 
    maxlength: 500 // Optional, with a max length
  },
  imageUrl: { 
    type: String,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(v); // Basic URL validation for images
      },
      message: props => `${props.value} is not a valid image URL!`
    }
  }
});

module.exports = mongoose.model('Jersey', jerseySchema);

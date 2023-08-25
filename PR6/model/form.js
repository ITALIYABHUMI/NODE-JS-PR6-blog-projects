const mongoose = require('mongoose');

const formSchema  = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    detail: {
        type: String,
        required:true
    },
    image: {
        type: String,
        required:true
    }
});


const form = mongoose.model('admin1',formSchema);

module.exports = form;

                                                                                           
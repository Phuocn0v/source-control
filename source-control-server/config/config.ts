const mongoose = {
    uri: 'mongodb://127.0.0.1:27017/source-control',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
}

export default {
    mongoose
}
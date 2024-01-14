import app from "./app";
import mongoose from "mongoose";
import * as config from "./config/config";
import { Server } from "http";

let server: Server;

mongoose.connect(config.default.mongoose.uri).then(() => {
    console.log('Connected to MongoDB: ' + config.default.mongoose.uri);
    server = app.listen(3000, () => {
        console.log('Server is running');
    });
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.log('Server closed');
            process.exit(1);
        })
    } else {
        process.exit(1);
    }
}

const unexpectedErrorHandler = (error: Error) => {
    console.log(error);
    exitHandler();
}

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
        server.close();
    }
});

const dotenv = require('dotenv');
dotenv.config();
const { serverConfig, dbConfig, mailConfig } = require('./src/config');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require("path");
app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(dbConfig.MONGODB_URI, dbConfig.MONGOOSE_OPTIONS)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {console.log("MongoDB not connected",err)
        process.exit(1);
    }
);

const apiRoutes = require('./src/routes');
app.use('/api', apiRoutes);


app.get('/', (req, res) => {
    res.status(200).send('Sevrer is running.........');
});


const PORT = serverConfig.BACKEND_PORT ;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


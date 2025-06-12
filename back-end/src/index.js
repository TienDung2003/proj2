const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const dbURI = process.env.DB_URL;
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());
app.use(express.json());
routes(app);

mongoose.connect(dbURI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error:', error);
    });

app.get('/', (req, res) => {
    res.send('hello');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
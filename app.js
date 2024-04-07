const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5001;


// Enable CORS for requests from port 3000 (your frontend domain)
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Middleware
app.use(cors());

app.use(bodyParser.json());

const uri = "mongodb+srv://paboda95official:MongoDb1995@cluster0.wjjt4qr.mongodb.net/concepta?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB connection
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => console.error('MongoDB connection error:', error));
// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
// async function run() {
//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     await mongoose.connect(uri, clientOptions);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await mongoose.disconnect();
//   }
// }
// run().catch(console.dir);


// Routes
const productEndpoints = require('./routes/productEndpoints');
const userEndpoints = require('./routes/userEndpoints');
const commentEndpoints = require('./routes/commentEndpoints');
const cartEndpoints = require('./routes/cartEndpoints');
const orderEndpoints = require('./routes/orderEndpoints');

app.use('/api/products', productEndpoints);
app.use('/api/users', userEndpoints);
app.use('/api/comments', commentEndpoints);
app.use('/api/carts', cartEndpoints);
app.use('/api/orders', orderEndpoints);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


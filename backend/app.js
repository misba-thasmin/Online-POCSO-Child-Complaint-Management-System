const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.pluralize(null);
const cors = require('cors');
const bodyParser = require('body-parser');


const fs = require('fs').promises;
const path = require('path');
const configPath = path.resolve(__dirname, 'helpers', 'config.json');

const machineId = require('node-machine-id');
let machineID; // Declare machineID variable
let license = "u3Y65£,;7Y#I";

// Get the machine ID
machineId.machineId()
  .then(id => {
    machineID = id;
    // console.log('Machine ID:', id);
    //console.log('license ID:', license);
  })
  .catch(error => {
    console.error('Error getting machine ID:', error);
  });





require('dotenv/config');

app.use(cors());
app.options('*', cors())

//middleware
app.use(express.json());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(morgan('tiny'));


//"email": "john.doe@example.com",
//"password": "yourpassword"



//Routes

const feedbackRoutes = require('./routes/feedback');
const userRoutes = require('./routes/user');
const officerRoutes = require('./routes/officer');
const adminRoutes = require('./routes/admin');
const complaintRoutes = require('./routes/complaint');
const aiRoutes = require('./routes/ai');
const locationRoutes = require('./routes/location');
const advocateRoutes = require('./routes/advocate');
const businesssRoutes = require('./routes/business');
const authRoutes = require('./routes/auth');





const api = process.env.API_URL;


// route call 

app.use(`${api}/business`, businesssRoutes);
app.use(`${api}/advocate`, advocateRoutes);
app.use(`${api}/feedback`, feedbackRoutes);
app.use(`${api}/user`, userRoutes);
app.use(`${api}/admin`, adminRoutes);
app.use(`${api}/officer`, officerRoutes);
app.use(`${api}/complaint`, complaintRoutes);
app.use(`${api}/ai`, aiRoutes);
app.use(`${api}/location`, locationRoutes);
app.use(`/api/auth`, authRoutes);


app.use('/public', express.static(path.join(__dirname, 'public')));


//CONNECTION_STRING = 'mongodb://localhost:27017/';
//  http://localhost:4000/api/v1/business/


//Database
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false, // Add this line
  dbName: 'complaint'
})
  .then(() => {
    console.log('Database Connection is ready...')
  })
  .catch((err) => {
    console.log(err);
  })

//Server
app.listen(4000, () => {

  console.log('server is running http://localhost:4000');
})

{/*
app.get("/message", (req, res) => {
    res.json({ message: "Hello from server!" });
  });
*/}
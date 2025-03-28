const cors = require("cors");

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173", "https://theywroteit.vercel.app"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } 

    if(allowedOrigins.indexOf(origin) !== -1){
      callback(null, true)
    }else {
      callback(new Error("CORS not allowed for this origin"), false);
    }
  
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  credentials: true, // Allow cookies to be sent
};

module.exports = cors(corsOptions);

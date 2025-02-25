
    const express = require("express");
  const passport = require("passport");
  const cors = require("cors");
  require("dotenv").config({path: ".env.development"});
  
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  const PORT = process.env.PORT || 3000;
  
      // Pass the global passport object into the configuration function
      require("./config/passport")(passport);
      // This will initialize the passport object on every request
      app.use(passport.initialize());
    
   //TODO: Change to frontend URI
  app.use(cors());
  
  app.use(require("./routes"));
  
  //catch all 404-handler
  app.use((req, res, next) => {
    res.status(404).json({
      error: "Not Found",
      message: `Cannot ${req.method} ${req.originalUrl}`,
    });
  });
  //catch unknown errors
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
    });
  });
  app.listen(PORT);
  
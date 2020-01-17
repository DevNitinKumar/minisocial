const express = require("express");
const app = express();
require("./Backend/data/dbConfig");
const bodyParser = require("body-parser");
const http = require("http");
const path = require("path");
const userRoute = require("./Backend/routes/users");
const postRoute = require("./Backend/routes/posts");
const messageRoute = require("./Backend/routes/message");
const _ = require("lodash");
const fs = require('fs');
const exec = require('child_process').exec;
const flash = require('express-flash');
const session = require('express-session');
const User = require("./Backend/data/middlewares/users");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const CronJob = require('cron').CronJob;
const backupDirPath = path.join(__dirname, 'database-backup');


/**
 * swagger config for API documentation
*/
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "ChatApp API",
        description: "ChatApp API Information",
        contact: {
          name: "Amazing Developer"
        },
        servers: ["http://localhost:3800"]
      },
      securityDefinitions : {
        Bearer: {
            type: "apiKey",
            name: "Authorization",
            in: "headers"
        }
      }
      // security: [{
      //   Bearer: []
      // }]
    },
    // ['.routes/*.js']
    apis: ['./Backend/routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);


// Parsers for POST data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"/dist/angular-chat")));
app.use("/Backend/data/uploads",express.static(path.join(__dirname,"/Backend/data/uploads")));

// to log every request
app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

// to set CORS
app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,PUT,DELETE,OPTIONS");
    next();
});

// route configuration
app.use("/api",userRoute);
app.use("/api",postRoute);
app.use("/api",messageRoute);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Point static path to dist
// app.use(express.static(path.join(__dirname, 'dist/insurance-app')));
// app.use("/",express.static(path.join(__dirname,"chatApp")));


// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/angular-chat/index.html'));
});



/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3800';
app.set('port', port);

/**
 * Create HTTP server.
*/
const server = http.createServer(app);
const io = require('socket.io').listen(server);
require('./Backend/socket/connection')(io,User,_);


const dbOptions = {
  user: '',
  pass: '',
  host: 'localhost',
  port: 27017,
  database: 'chatapp',
  autoBackup: true,
  removeOldBackup: true,
  keepLastDaysBackup: 2,
  autoBackupPath: backupDirPath
};

/**
 * Auto Backup Functionality Starts
*/

// return stringDate as a date object.
exports.stringToDate = dateString => {
  return new Date(dateString);
};

// Check if variable is empty or not.
exports.empty = mixedVar => {
  let undef, key, i, len;
  const emptyValues = [undef, null, false, 0, '', '0'];
  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i]) {
      return true;
    }
  }
  if (typeof mixedVar === 'object') {
    for (key in mixedVar) {
      return false;
    }
    return true;
  }
  return false;
};


// Auto backup function
dbAutoBackUp = () => {
  // check for auto backup is enabled or disabled
  if (dbOptions.autoBackup == true) {
    let date = new Date();
    let beforeDate, oldBackupDir, oldBackupPath;
    // Current date
    currentDate = this.stringToDate(date);
    let newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    // New backup path for current backup process
    let newBackupPath = dbOptions.autoBackupPath + '-mongodump-' + newBackupDir;
    // check for remove old backup after keeping # of days given in configuration
    if (dbOptions.removeOldBackup == true) {
      beforeDate = _.clone(currentDate);
      // Substract number of days to keep backup and remove old backup
      beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup);
      oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
      // old backup(after keeping # of days)
      oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir;
    }

    // Command for mongodb dump process
    let cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --out ' + newBackupPath;

    exec(cmd, (error, stdout, stderr) => {
      if (this.empty(error)) {
        // check for remove old backup after keeping # of days given in configuration.
        if (dbOptions.removeOldBackup == true) {
          if (fs.existsSync(oldBackupPath)) {
            exec('rm -rf ' + oldBackupPath, err => {});
          }
        }
      }
    });
  }
};

const job = new CronJob('00 30 11 * * 1-5', function() {
	// const d = new Date();
  // console.log('every 1 seconds');
  dbAutoBackUp();
});
job.start();

/**
 * Auto Backup Functionality ends
*/

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`Server running on:${port}`));

  

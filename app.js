var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connected=require("./config/db");

var DoctorsRoutes=require("./routes/doctor.routes");
var PatientsRoutes=require("./routes/patient.routes");
var AppointmentRoutes=require("./routes/appointment.routes");
var errorHandler=require("./middleware/errorHandler");


var app = express();
connected();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/doctors',DoctorsRoutes)
app.use('/patients',PatientsRoutes)
app.use('/appointments',AppointmentRoutes)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(errorHandler);


module.exports = app;

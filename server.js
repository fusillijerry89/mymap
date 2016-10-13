//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var express = require('express');


var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// var url = 'mongodb://localhost:27017/test';
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected correctly to server.");
//   db.close();
// });

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var staticServer = express();
var api = express();
var bodyParser = require('body-parser');

// req.body will be undefined w/o these
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({
    extended: true
}));

staticServer.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
staticServer.use(express.static(path.resolve(__dirname, 'client')));

var mongoose = require('mongoose');

var url = 'mongodb://fusilli.jerry89:juno7278972789@ds053136.mlab.com:53136/mymap';

var Nodes;

mongoose.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        console.log('Connection established to', url);

        var Schema = mongoose.Schema;

        // create a database schema
        var nodeSchema = new Schema({
            id : { type : Number, required : true, unique : true },
            title : String,
            xPos : Number,
            yPos : Number
        });

        NodeSchema = mongoose.model('Node', nodeSchema);

        module.exports = NodeSchema;
    }
});

api.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
 });

api.get('/nodes', function (req, res, next) {
    console.log("GET nodes");
    NodeSchema.find({}, function(err, nodes) {
        if (err) throw err;

        res.send(nodes);
    });
});

// api.get('/food/:id', function (req, res, next) {
//     console.log("GET");
//     Food.findOne({ _id : req.params.id }, function(err, food) {
//         if (err) throw err;
//
//         res.send(food);
//     });
// });

api.post('/node', function (req, res, next) {
    console.log("POSTing new node");
    var node = {
        id : Date.now(),
        title : req.body.title,
        posX : req.body.posX,
        posY : req.body.posY
    };

    var newNode = new NodeSchema(node);

	newNode.save(function(err, newNode) {
        if (err) throw err;

        res.send(newNode);
    });
});

api.post('/node/:id', function (req, res, next) {
    console.log("UPDATING " + req.params.id);
    NodeSchema.findOne({ id : req.params.id }, function(err, node) {
        if (err)
            return res.send(err);

        for (prop in req.body) {
          node[prop] = req.body[prop];
        }

        node.save(function(err) {
          if (err) {
            return res.send(err);
          }

          res.json({ message: 'Node updated!' });
        });
      });
});

// api.delete('/food/:id', function (req, res, next) {
//     Food.findOne({ _id: req.params['id'] }, function(err, badFood) {
//         if (err) throw err;
//
//         badFood.remove(function (err, food) {
//             if (err) throw err;
//
//             res.send('Bad food successfully thrown out!');
//         });
//     });
// });

staticServer.listen(8080);
api.listen(8081);

console.log("Servers started.");

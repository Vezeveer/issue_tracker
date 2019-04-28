/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const shortid = require('shortid');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  MongoClient.connect(CONNECTION_STRING, function(err, db) {
    if(err) {
      console.log('Database error: ' + err);
    } else {
      console.log('Successful database connection');
    }
  
    const date = new Date()
    app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      db.collection('project').find({}).toArray((err,result)=>{
        if(err)console.log('Error at get: ', err)
        res.send(result)
      })
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      
      db.collection('project').findOne({issue_title: req.body.issue_title},function(err,data){
        if(err)return err;
        if(req.body.issue_title == null || req.body.issue_text == null || req.body.created_by == null){
          return res.status(400).send('should not be empty...')
        }
        if(true){
          db.collection('project')
            .insertOne({
              _id: shortid.generate(),
              issue_title: req.body.issue_title, 
              issue_text: req.body.issue_text,
              created_by: req.body.created_by,
              assigned_to: req.body.assigned_to,
              status_text: req.body.status_text,
              open: true,
              created_on: date.toUTCString(),
              updated_on: date.toUTCString()
            }, (err,doc) => {
            if(err){console.log(err)}
            else res.send(doc.ops[0])
          })
        }
      })
    })
    
    .put(function (req, res){
      var project = req.params.project;
      if(req.body.issue_title == null && req.body.issue_text == null && req.body.created_by == null){
          return res.send('no updated field sent')
        }
      db.collection('project').findOne({_id: req.body._id}, (err, data)=>{
        db.collection('project').findOneAndUpdate({_id: req.body._id},
          {
            issue_title: req.body.issue_title ? req.body.issue_title : data.issue_title, 
            issue_text: req.body.issue_text ? req.body.issue_text : data.issue_text,
            created_by: req.body.created_by ? req.body.created_by : data.created_by,
            assigned_to: req.body.assigned_to ? req.body.assigned_to : data.assigned_to,
            status_text: req.body.status_text ? req.body.status_text : data.status_text,
            open: true,
            created_on: data.created_on,
            updated_on: date.toUTCString()
          },{returnOriginal: false},
          (err,doc)=>{
            if(err){console.log('Error at put: ', err)}
            else{
              console.log('successfully updated: ')
              res.send(doc.value)
            }
          }
        )
        if(err)console.log(err)
      })
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      if(req.body._id == null){
        return res.status(400).send('_id error')
      }
      db.collection('project').deleteOne({_id: req.body._id}, function(err,obj){
        if(err)console.log(err)
        res.send('deleted ' + req.body._id)
      })
    });
    
  });
};

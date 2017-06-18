const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:admin@localhost:5432/baudosjogos';
const async = require('async');

var Game = require('../bean/Game');
var systemDao = require('./system');

function getGames(id, callback) {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      var err = new Error(err);
      callback(err);
    }
    // SQL Query > Select Data
    var query = null;
    if(id) {
        query = client.query('SELECT * FROM game WHERE code = ($1) ORDER BY name ASC;',
        [id]);
    } else {
        query = client.query('SELECT * FROM game ORDER BY name ASC;');
    }
      
    // Stream results back one row at a time
    query.on('row', (row) => {
     results.push(row)
      
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      var newRes = [];
      var tasks = []
      results.forEach(function(row){
        tasks.push(function(callback) {
            getAdditionalData(row,function(game) {
                newRes.push(game);
                callback(null,game)
            })
        }
      )});
      
     async.parallel(tasks, function(err, result) {
        /* this code will run after all calls finished the job or
       when any of the calls passes an error */
        if (err)
            return console.log(err);
        callback(newRes);
     });
      
    });
  });
}

function insertGame(data, callback) {
  
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => { 	
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      var err = new Error(err);
      callback(err);
    }
    // SQL Query > Insert Data
    const query = client.query('INSERT INTO game(name) values($1)',
    [data.text]);
     query.on('end', () => {
      done();
       callback({});
    });  
    
  });
}

function updateGame(id, data, callback) {
  
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      var err = new Error(err);
      callback(err);
    }
    // SQL Query > Update Data
    const query = client.query('UPDATE game SET name=($1) WHERE code=($2)',
    [data.text, id]);
       query.on('end', () => {
      done();
       callback({});
    });  
  });
}

function deleteGame(id, callback) {
  
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      var err = new Error(err);
      callback(err);
    }
    // SQL Query > Update Data
    const query = client.query('DELETE FROM game WHERE code=($1)', [id]);
    
     query.on('end', () => {
      done();
       callback({});
    });  
  });
}

function getAdditionalData(game,callback) {
  var game = new Game(game.code,game.name);
   getRelatedSystems(game.code,function(results){
       game.systems = results;
       callback(game);
   })
}

function getRelatedSystems(code,callback) {
  const results = [];
  pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      console.log(err);
      var err = new Error(err);
      callback(err);
    }
    
    var query = client.query('SELECT s.name FROM game_has_system as gs, system as s WHERE gs.game_code = ($1) and s.code = gs.system_code ORDER BY s.name ASC;', [code]);
     
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      callback(results);
    });
  });
 //callback([]);
}

module.exports.getGames   = getGames;
module.exports.insertGame = insertGame;
module.exports.updateGame = updateGame;
module.exports.deleteGame = deleteGame;
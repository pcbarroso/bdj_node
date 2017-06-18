const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:admin@localhost:5432/baudosjogos';

var System = require('../bean/System');

function getSystems(id, callback) {
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
        query = client.query('SELECT * FROM system WHERE code = ($1) ORDER BY name ASC;',
        [id]);
    } else {
        query = client.query('SELECT * FROM system ORDER BY name ASC;');
    }
      
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
}

function insertSystem(data, callback) {
  
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
    const query = client.query('INSERT INTO system(name) values($1)',
    [data.text]);
     query.on('end', () => {
      done();
       callback({});
    });  
    
  });
}

function updateSystem(id, data, callback) {
  
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      var err = new Error(err);
      callback(err);
    }
    // SQL Query > Update Data
    const query = client.query('UPDATE system SET name=($1) WHERE code=($2)',
    [data.text, id]);
       query.on('end', () => {
      done();
       callback({});
    });  
  });
}

function deleteSystem(id, callback) {
  
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      var err = new Error(err);
      callback(err);
    }
    // SQL Query > Update Data
    const query = client.query('DELETE FROM system WHERE code=($1)', [id]);
    
     query.on('end', () => {
      done();
       callback({});
    });  
  });
}

module.exports.getSystems   = getSystems;
module.exports.insertSystem = insertSystem;
module.exports.updateSystem = updateSystem;
module.exports.deleteSystem = deleteSystem;
const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:admin@localhost:5432/baudosjogos';


function getGenres(id, callback) {
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
        query = client.query('SELECT * FROM genre WHERE id = ($1) ORDER BY text ASC;',
        [id]);
    } else {
        query = client.query('SELECT * FROM genre ORDER BY text ASC;');
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

function insertGenre(data, callback) {
  
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
    const query = client.query('INSERT INTO genre(text) values($1)',
    [data.text]);
     query.on('end', () => {
      done();
       callback({});
    });  
    
  });
}

function updateGenre(id, data, callback) {
  
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      var err = new Error(err);
      callback(err);
    }
    // SQL Query > Update Data
    const query = client.query('UPDATE genre SET text=($1) WHERE id=($2)',
    [data.text, id]);
       query.on('end', () => {
      done();
       callback({});
    });  
  });
}

function deleteGenre(id, callback) {
  
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      var err = new Error(err);
      callback(err);
    }
    // SQL Query > Update Data
    const query = client.query('DELETE FROM genre WHERE id=($1)', [id]);
    
     query.on('end', () => {
      done();
       callback({});
    });  
  });
}

module.exports.getGenres = getGenres;
module.exports.insertGenre = insertGenre;
module.exports.updateGenre = updateGenre;
module.exports.deleteGenre = deleteGenre;
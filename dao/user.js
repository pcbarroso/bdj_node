const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:admin@localhost:5432/baudosjogos';
const async = require('async');

var gameDao = require('./game');

getUsers = function(id, callback) {
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
        query = client.query('SELECT * FROM users WHERE id = ($1) ORDER BY id ASC;',
        [id]);
    } else {
        query = client.query('SELECT * FROM users ORDER BY id ASC;');
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

getUserGames = function(id, callback) {
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
    var query = client.query('SELECT * FROM users_has_game WHERE user_code = ($1) ORDER BY game_code ASC;',[id]);

    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      var newRes = [];
      var tasks = []
      results.forEach(function(row){
        tasks.push(function(callback) {
            var userGame = {'system_code':row.system_code,'qtd':row.qtd}
            gameDao.getGames(row.game_code,function(game) {
                userGame.game = game;
                newRes.push(userGame);
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


getUserByMail = function(mail, callback) {
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
    const query = client.query('SELECT * FROM users WHERE mail = ($1) ORDER BY id ASC;', [mail]);
    
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

insertUser = function(data, callback) {
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
    getUserByMail(data.mail,function(results){
        if(results.length ==0) {
             const query = client.query('INSERT INTO users(mail,name,nickname,age,sex) values($1,$2,$3,$4,$5)',
            [data.mail, data.name, data.nickname, data.age, data.sex]);
            query.on('end', () => {
              done();
              callback({});
            });
           
         } else {
             var err = new Error("Já existe um usuário cadastrado com esse email");
             callback(err);
         }
    });
   
  });
}

updateUser = function(id,data,callback) {
    pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
       var err = new Error(err);
        callback(err);
    }
    
    getUserByMail(data.mail,function(results){
        if(results.length ==0 || (results.length == 1 && results[0].id == id)) {
              const query = client.query('UPDATE users SET mail=($1), name=($2), nickname=($3), age=($4), sex=($5) WHERE id=($6)',
                [data.mail, data.name, data.nickname, data.age, data.sex,id]);
                 query.on('end', () => {
                  done();
                  callback({});
                });
         } else {
             var err = new Error("Já existe um usuário cadastrado com esse email");
             callback(err);
         }
    });
        
   
  });
}

deleteUser = function(id,callback) {
   pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
       var err = new Error(err);
        callback(err);
    }
    // SQL Query > Delete Data
    const query = client.query('DELETE FROM users WHERE id=($1)', [id]);
    query.on('end', () => {
      done();
      callback({});
    });
  });
}

module.exports.getUsers = getUsers;
module.exports.getUserGames = getUserGames;
module.exports.insertUser = insertUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
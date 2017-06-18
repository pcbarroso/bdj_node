const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');

var gamesDao = require('../dao/game');

router.get('/game', (req, res, next) => {
    try {
        gamesDao.getGames(null,function(results){
            if(results instanceof Error) {
                 return res.status(500).json({success: false, data: results.toString()});    
            } else {
                return res.json(results);
            }
        })
    } catch (err) {
        return res.status(500).json({success: false, data: err.toString()});    
    }
});

router.get('/game/:game_id', (req, res, next) => {
    const id = req.params.game_id;
    try {
        gamesDao.getGames(id,function(results){
            if(results instanceof Error) {
                return res.status(500).json({success: false, data: results.toString()});    
            } else {
                return res.json(results);
            }
        })
    } catch (err) {
        return res.status(500).json({success: false, data: err.toString()});    
    }
});

router.post('/game', (req, res, next) => {
    const data = {text: req.body.name};
  
    try {
        gamesDao.insertGame(data,function(results) {
             if(results instanceof Error) {
              return res.status(500).json({success: false, data: results.toString()});    
             } else {
                gamesDao.getGames(null,function(results){
                    if(results instanceof Error) {
                        throw results;
                    } else {
                        return res.json(results);
                    }
                });
            }
        });
    } catch (err) {
        return res.status(500).json({success: false, data: err.toString()});    
    }
});

router.put('/game/:game_id', (req, res, next) => {

    const id = req.params.game_id;
    const data = {text: req.body.name};
  
    try {
       gamesDao.updateGame(id, data,function(results) {
             if(results instanceof Error) {
                return res.status(500).json({success: false, data: results.toString()});    
             } else {
                gamesDao.getGames(null,function(results){
                    if(results instanceof Error) {
                        throw results;
                    } else {
                        return res.json(results);
                    }
                });
            }
        });
    } catch (err) {
        return res.status(500).json({success: false, data: err.toString()});    
    }
});

router.delete('/game/:game_id', (req, res, next) => {
  const id = req.params.game_id;
    
    try {
       gamesDao.deleteGame(id,function(results) {
             if(results instanceof Error) {
               return res.status(500).json({success: false, data: results.toString()});    
             } else {
                gamesDao.getGames(null,function(results){
                    if(results instanceof Error) {
                        throw results;
                    } else {
                        return res.json(results);
                    }
                });
            }
        });
    } catch (err) {
        return res.status(500).json({success: false, data: err.toString()});    
    }
});

module.exports = router;
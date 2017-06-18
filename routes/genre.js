const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');

var genreDao = require('../dao/genre');

router.get('/genre', (req, res, next) => {
    try {
        genreDao.getGenres(null,function(results){
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

router.get('/genre/:genre_id', (req, res, next) => {
    const id = req.params.genre_id;
    try {
        genreDao.getGenres(id,function(results){
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

router.post('/genre', (req, res, next) => {
    const data = {text: req.body.description};
  
    try {
        genreDao.insertGenre(data,function(results) {
             if(results instanceof Error) {
              return res.status(500).json({success: false, data: results.toString()});    
             } else {
                genreDao.getGenres(null,function(results){
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

router.put('/genre/:genre_id', (req, res, next) => {

    const id = req.params.genre_id;
    const data = {text: req.body.description};
  
    try {
       genreDao.updateGenre(id, data,function(results) {
             if(results instanceof Error) {
                return res.status(500).json({success: false, data: results.toString()});    
             } else {
                genreDao.getGenres(null,function(results){
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

router.delete('/genre/:genre_id', (req, res, next) => {
  const id = req.params.genre_id;
    
    try {
       genreDao.deleteGenre(id,function(results) {
             if(results instanceof Error) {
               return res.status(500).json({success: false, data: results.toString()});    
             } else {
                genreDao.getGenres(null,function(results){
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
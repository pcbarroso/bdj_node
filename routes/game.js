const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');

var genreGames = require('../dao/game');

router.get('/game', (req, res, next) => {
    try {
        genreGames.getGames(null,function(results){
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

module.exports = router;
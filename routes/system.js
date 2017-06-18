const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');

var systemDao = require('../dao/system');

router.get('/system', (req, res, next) => {
    try {
        systemDao.getSystems(null,function(results){
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

router.get('/system/:system_id', (req, res, next) => {
    const id = req.params.system_id;
    try {
        systemDao.getSystems(id,function(results){
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

router.post('/system', (req, res, next) => {
    const data = {text: req.body.name};
  
    try {
        systemDao.insertSystem(data,function(results) {
             if(results instanceof Error) {
              return res.status(500).json({success: false, data: results.toString()});    
             } else {
                systemDao.getSystems(null,function(results){
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

router.put('/system/:system_id', (req, res, next) => {

    const id = req.params.system_id;
    const data = {text: req.body.name};
  
    try {
       systemDao.updateSystem(id, data,function(results) {
             if(results instanceof Error) {
                return res.status(500).json({success: false, data: results.toString()});    
             } else {
                systemDao.getSystems(null,function(results){
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

router.delete('/system/:system_id', (req, res, next) => {
  const id = req.params.system_id;
    
    try {
       systemDao.deleteSystem(id,function(results) {
             if(results instanceof Error) {
               return res.status(500).json({success: false, data: results.toString()});    
             } else {
                systemDao.getSystems(null,function(results){
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
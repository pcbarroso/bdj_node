const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');

var userDao = require('../dao/user');

router.get('/user', (req, res, next) => {
    try {
        userDao.getUsers(null,function(results){
            if(results instanceof Error) {
                return res.status(500).json({success: false, data: results.toString()});    
            } else {
                return res.json(results);
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, data: err.toString()});    
    }
});

router.get('/user/:user_id', (req, res, next) => {
    const id = req.params.user_id;
    try {
        userDao.getUsers(id,function(results){
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

router.post('/users', (req, res, next) => {
  const data = {mail: req.body.mail,
               name:req.body.name,
               nickname:req.body.nickname,
               age:req.body.age,
               sex:req.body.sex};
  try {
        userDao.insertUser(data,function(results){
            if(results instanceof Error) {
                return res.status(500).json({success: false, data: results.toString()});    
            } else {
                userDao.getUsers(null,function(results){
                    if(results instanceof Error) {
                        throw results;
                    } else {
                        return res.json(results);
                    }
                })
            }
        })
    } catch (err) {
        return res.status(500).json({success: false, data: err.toString()});    
    }
});

router.put('/users/:user_id', (req, res, next) => {
 
  const id = req.params.user_id;
  const data = {mail: req.body.mail,
               name:req.body.name,
               nickname:req.body.nickname,
               age:req.body.age,
               sex:req.body.sex};
  
    try {
        userDao.updateUser(id,data,function(results){
            if(results instanceof Error) {
                return res.status(500).json({success: false, data: results.toString()});
            } else {
                userDao.getUsers(null,function(results){
                    if(results instanceof Error) {
                        throw results;
                    } else {
                        return res.json(results);
                    }
                })
            }
        })
    } catch (err) {
         return res.status(500).json({success: false, data: err.toString()});    
    }
  
});

router.delete('/users/:user_id', (req, res, next) => {
  const id = req.params.user_id;
 
    try {
        userDao.deleteUser(id,function(results){
            if(results instanceof Error) {
                return res.status(500).json({success: false, data: results.toString()});    
            } else {
                userDao.getUsers(null,function(results){
                    if(results instanceof Error) {
                        throw results;
                    } else {
                        return res.json(results);
                    }
                })
            }
        })
    } catch (err) {
        return res.status(500).json({success: false, data: err.toString()});    
    }
  
});

module.exports = router;
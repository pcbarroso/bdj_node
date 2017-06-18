var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Expressc' });
  res.sendFile('pages/index.html',{ root: 'public' });
});

router.get('/games', function(req, res, next) {
  //res.render('index', { title: 'Expressc' });
  res.sendFile('pages/games.html',{ root: 'public' });
});

module.exports = router;

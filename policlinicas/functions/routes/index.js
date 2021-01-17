var express = require('express');
var router = express.Router();

var personasController = require('../controllers/personas');
var actividadesController = require('../controllers/actividades');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Manejo de notificaciones
router.get('/notificaciones', personasController.renderIndex);

// Crear persona
router.get('/persona/:id', personasController.renderCreate);
router.get('/persona/crear', personasController.renderCreate);
router.post('/persona/crear', personasController.createPerson);

// Manejo de policlinicas
router.get('/policlinicas', function(req, res, next){
  res.send("A response with resources for clinics");
});

// Manejo de actividades
router.get('/actividades', actividadesController.renderIndex);

module.exports = router;

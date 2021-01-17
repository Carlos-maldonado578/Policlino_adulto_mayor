var express = require('express');
var firebase = require('firebase');

var app = express()
app.set('views', __dirname + '/views');

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyALraUSK1peWVAGX5eYzxfFZ7pTvMZq7cE",
    authDomain: "policlinicoadultosmayores.firebaseapp.com",
    projectId: "policlinicoadultosmayores",
});
  
var db = firebase.firestore();

// Schema de persona:
// {
//     'nombre': String,
//     'direccion': String,
//     'correo': String,
//     'telefono': String,
//     'rut': String,
//     'edad': Number,
//     'responsables': [
//         {
//             'nombre': String,
//             'direccion': String,
//             'correo': String,
//             'telefono': String,
//             'rut': String,
//             'edad': Number,
//         }, .....
//     ]
// }

// Listar personas
const listPerson = () => (
    db.collection("persona").get()
)

// Obtener una persona
const getPersonById = (id) => (
    db.collection("persona").doc(id).get()
        .then((doc) => {
            if (doc.exists){
                console.log(doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
        .catch((error) => {
            console.log(error);
        })
)

const getPersonByRUT = (rut) => (
    db.collection("persona").where("rut", "==", rut).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data());
            });
        })
        .catch((error) => {
            console.log(error);
        })
)

// Crear persona
const createPerson = ({...person}) => {
    return db.collection("persona").add(person);
}

// Actualizar persona


// Borrar persona



exports.renderIndex = function(req, res, next) {
    var personas = listPerson();
    // var personas = [
    //     {
    //         direccion: 'Buenos Aires',
    //         rut: '123456789-0',
    //         responsables: [
    //         {
    //             telefono: '38011751',
    //             nombre: 'Rita Chacon',
    //             edad: 28,
    //             direccion: 'Buenos Aires',
    //             correo: 'rita@gmail.com',
    //             rut: '123456790-0'
    //         }
    //         ],
    //         edad: 28,
    //         correo: 'evalderrama862@gmail.com',
    //         nombre: 'Edgar',
    //         telefono: '38011751'
    //     },
    //     {
    //         telefono: '38011751',
    //         rut: '1234567891-0',
    //         nombre: 'Pepe Rodriguez',
    //         responsable: [],
    //         correo: 'peper@gmail.com',
    //         edad: 78,
    //         direccion: 'Santiago'
    //     }
    // ]

    personas.then((querySnapshot) => {
        var personas = []
        querySnapshot.forEach((doc) => {
            personas.push(doc.data())
        });
        console.log(personas);
        res.render('lista', {'personas': personas});
    })
};

exports.renderCreate = function(req, res, next) {
    res.render('crear');
}

exports.createPerson = function(req, res, next) {
    var persona = req.body;
    persona['responsables'] = [];
    
    createPerson(req.body)
    .then((docRef) => {
        console.log("Person created with ID: ", docRef.id);
        return res.redirect('/notificaciones');
    })
    .catch((error) => {
        console.log("Error adding document: ", error);
        return res.render('crear', {message: "Ocurrio un error..."});
    })   
}

exports.renderEdit = function(req, res, next){
    res.render('crear', {})
}
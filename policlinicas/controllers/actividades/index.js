var firebase = require('firebase');

var db = firebase.firestore();

// Schema de actividad:
// {
//     'descripcion': String,
//     'fecha': String,
//     'imagen': String,
//     'policlinica': Reference,
// }

// Listar actividades
const listActivities = () => (
    db.collection("actividad").get()
)

// Obtener una actividad
const getActivityById = (id) => (
    db.collection("actividad").doc(id).get()
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

// Crear actividad
const createActivity = ({...actividad}) => {
    return db.collection("actividad").add(actividad);
}

// Actualizar persona


// Borrar persona
const deleteActivity = (id) => {
    db.collection('actividad').doc(id).delete()
}


exports.renderIndex = function(req, res, next) {
    var actividades = listActivities();
    
    actividades.then((querySnapshot) => {
        var actividades = []
        querySnapshot.forEach((doc) => {
            var data = doc.data();
            data['fecha'] = data['fecha'].toDate();
            actividades.push(data);
        });
        
        res.render('actividades/lista', {'actividades': actividades});
    })
};

exports.renderCreate = function(req, res, next) {
    res.render('actividades/crear');
}

exports.createPerson = function(req, res, next) {
    var actividad = req.body;
    
    createActivity(actividad)
    .then((docRef) => {
        console.log("Activity created with ID: ", docRef.id);
        return res.redirect('/actividades');
    })
    .catch((error) => {
        console.log("Error adding document: ", error);
        return res.render('actividades/crear', {message: "Ocurrio un error..."});
    })
}

exports.renderEdit = function(req, res, next){
    res.render('actividades/crear', {})
}
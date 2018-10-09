import express = require('express');
export const routes = express.Router();

import admin = require('firebase-admin');
const serviceAccount = require('./ServiceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore();

routes.get('/', (req, res) => {
    res.send('Hello World');

    
    let ref = db.collection('users').where('userId', '==', 'V1SXl0pI8JRViyVDsZO2F3wlS8I2');
    
    ref.get().then(result => {
        result.forEach(doc => {
            let subcollection = JSON.stringify(doc.data());
            console.log(`${doc.id} => ${subcollection}`);
        })
    });
});

/* routes.get('/users', (req, res) => {
    res.send([])
});

routes.post('/users', (req, res) => {
    res.send({ body: req.body })
}); */
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'smart-brain'
    }
  });

db.select('*').from('users').then(data => {
    console.log(data);
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req,res) => {
    res.send(database.users);
});

app.post('/signin', (req,res) => {
    // Load hash from your password DB.
    bcrypt.compare('apples', '$2b$10$nqzSskz1eK6PJe1mhulZBuPdfmx0o7mV.e.t7bLmViuVDU9TjVKpK', function(err, res) {
        /* console.log('first guess', res); */
    });
    bcrypt.compare('veggies', '$2b$10$nqzSskz1eK6PJe1mhulZBuPdfmx0o7mV.e.t7bLmViuVDU9TjVKpK', function(err, res) {
        /* console.log('second guess', res); */
    });
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
    }
    else {
        res.status(400).json('error logging in');
    }
});

app.post('/register', (req,res) => {
    const {email, name, password } = req.body;
    
    db('users')
        .returning('*')
        .insert({
            email:email,
            name:name,
            joined: new Date()
        })
        .then(user => {
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;

    db.select('*').from('users').where({
        id:id
    })
        .then(user => {
            if(user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('no such user');
            }
    })
        .catch(err => res.status(400).json('error getting user'));
});

app.put('/image', (req,res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
});

app.listen(3000 , () => {
    console.log('app is running on port 3000');
});

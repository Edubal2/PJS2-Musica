var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Se carga el módulo de sqlite3
var sqlite3 = require('sqlite3');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//se carga el modulo de knex
//se inicializa knex con sqlite3

var db = require('knex')({
        client: 'sqlite3',
        connection: {
            filename: 'musica.sqlite'
        },
        useNullAsDefault: true,
    }
);

// Estas rutas predefinidas no las vamos a usar
//app.use('/', indexRouter);
//app.use('/users', usersRouter);


// RUTAS DEL USUARIO

//Rutas para artists
// GET
app.get('/api/artists', function (req, res) {
    db.select('ar.id', 'ar.name')
        .from('artists as ar')
        .then(function (data) {

            result = {}
            result.artists = data;
            res.json(result)


        });
});

//Seleccion por id
app.get('/api/artists/:id', function (req, res) {

    let id = parseInt(req.params.id);
    db.select('ar.id', 'ar.name')
        .from('artists as ar')
        .where('ar.id', id)
        .then(function (data) {

            result = {}
            result.artists = data;
            res.json(result)


        });
});

// DELETE
app.delete('/api/artists/:id', function (req, res) {

    // Como es un string lo convertimos en entero
    let id = parseInt(req.params.id);
    console.log('WILL DELETE' + id);

    db.delete()
        .from('artists')
        .where('id', id)
        .then(function (data) {
            res.json(data);
        }).catch(function (error) {
        console.log(error)
    });
});

// ADD
app.post('/api/artists', function (req, res) {

    let data_form = req.body;
    console.log('app.je app.post(). Params:', data_form)

    db.insert(data_form)
        .into('artists')
        .then(function (data) {

            res.json(data)
            console.log(data)
        }).catch(function (error) {
        console.log(error)
    });

});

// Modify
app.post('/api/artists/:id', function (req, res) {
    let id = req.params.id;
    let artistData = req.body;

    db('artists')
        .update(artistData)
        .where('id', id)
        .then(function (data) {
            res.json(data)
        })
        .catch(function (error) {
            logger.error('ERROR:', error);
        })
});


// Rutas para albums
// GET
app.get('/api/albums', function (req, res) {
    db.select('al.id', 'al.title', 'ar.name as artists', 'al.image', 'al.description')
        .from('albums as al')
        .join('artists as ar', 'al.artist_id', 'ar.id')
        .then(function (data) {

            result = {}
            result.albums = data;
            res.json(result)

            //tambien se podira haber echo así
            // return {albums: data};

        }).catch(function (error) {
        console.log(error)
    });
});

// Seleccion por id
app.get('/api/albums/:id', function (req, res) {

    // Como es un string lo convertimos en entero
    let id = parseInt(req.params.id);
    db.select('al.id', 'al.title', 'al.image', 'al.description')
        .from('albums as al')
        .where('al.id', id)
        .then(function (data) {
            res.json(data);
        }).catch(function (error) {
        console.log(error)
    });
});

// ADD
app.post('/api/albums', function (req, res) {

    let data_form = req.body;
    console.log('app.je app.post(). Params:', data_form)

    db.insert(data_form)
        .into('albums')
        .then(function (data) {

            res.json(data)
            console.log(data)
        }).catch(function (error) {
        console.log(error)
    });

});

//Modify
app.post('/api/albums/:id', function (req, res) {
    let id = req.params.id;
    let albumData = req.body;

    db('Albums')
        .update(albumData)
        .where('id', id)
        .then(function (data) {
            res.json(data)
        })
        .catch(function (error) {
            logger.error('ERROR:', error);
        })
});

// DELETE
app.delete('/api/albums/:id', function (req, res) {

    // Como es un string lo convertimos en entero
    let id = parseInt(req.params.id);
    console.log('WILL DELETE' + id);

    db.delete()
        .from('albums')
        .where('id', id)
        .then(function (data) {
            res.json(data);
        }).catch(function (error) {
        console.log(error)
    });

});


// Rutas para songs
// GET
app.get('/api/songs/', function (req, res) {

    db.select('so.id', 'so.title', 'so.length', 'al.title as album', 'ar.name as artist')
        .from('songs as so')
        .join('albums as al', 'so.album_id', 'al.id')
        .join('artists as ar', 'al.artist_id', 'ar.id')
        .then(function (data) {

            result = {}
            result.songs = data;
            res.json(result)


        });
});

// Seleccion por id
app.get('/api/songs/:id', function (req, res) {

    let id = parseInt(req.params.id);
    db.select('so.id', 'so.title', 'so.length')
        .from('songs as so')
        .where('so.id', id)
        .then(function (data) {
            res.json(data);
        }).catch(function (error) {
        console.log(error)
    });
});

// DELETE
app.delete('/api/songs/:id', function (req, res) {

    let id = parseInt(req.params.id);
    console.log('WILL DELETE' + id);

    db.delete()
        .from('songs')
        .where('id', id)
        .then(function (data) {
            res.json(data);
        }).catch(function (error) {
        console.log(error)
    });

});

// ADD
app.post('/api/songs/', function (req, res) {

    let data_form = req.body;
    console.log('app.je app.post(). Params:', data_form)

    db.insert(data_form)
        .into('songs')
        .then(function (data) {

            res.json(data)
            console.log(data)
        }).catch(function (error) {
        console.log(error)
    });

});

// Modify
app.post('/api/songs/:id', function (req, res) {
    let id = req.params.id;
    let songData = req.body;

    db('Songs')
        .update(songData)
        .where('id', id)
        .then(function (data) {
            res.json(data)
        })
        .catch(function (error) {
            logger.error('ERROR:', error);
        })
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

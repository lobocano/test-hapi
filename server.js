/**
 * Created by pablo on 14.03.16.
 */
'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Path = require('path');
const Joi = require('joi');
var pg = require('pg');
var conString = "postgres://hapi:mensajero@localhost/testhapi";


const server = new Hapi.Server();
server.connection({port: 3041});

server.state('userdata', {
    ttl: 60 * 60 * 1000,
    isSecure: false,
    isHttpOnly: false,
    encoding: 'base64json',
    clearInvalid: false, // remove invalid cookies
    strictHeader: true // don't allow violations of RFC 6265
});

server.route({
    method: 'POST',
    path: '/auth/register',
    config:{
        validate: {
            payload: {
                username: Joi.string().min(3).max(20).required(),
                email: Joi.string().email().required(),
                displayname: Joi.string().min(1).max(20).required(),
                password: Joi.string().min(2).max(20).required(),
                password2: Joi.string().min(2).max(20).required()
            }
        },
        handler: regUser

    }
});

server.route({
    method: 'POST',
    path: '/auth/login',
    config:{
        auth: false,
        validate: {
            payload: {
                username: Joi.string().min(3).max(20).required(),
                password: Joi.string().min(2).max(20).required()
            }
        },
        handler: function (request, reply) {
            console.log(request.payload);
            var sql = 'select * from users where username = $1';
            querySql(sql, [request.payload.username], (err, result)=> {
                if (err) {
                    console.log(err);
                    reply('ERROR');
                }
                else {
                    if (result.rows.length == 0) {
                        reply('user not found');
                    }
                    else {
                        var usr = result.rows[0];
                        console.log(usr);
                        if (request.payload.password == usr.password) {
                            var minUserData = {
                                username: usr.username,
                                email: usr.email,
                                displayname: usr.displayname
                            };
                            request.cookieAuth.set(minUserData);
                            console.log(minUserData);
                            reply('OK').state('userdata',{username: 'lkajldkjjd'});
                        }
                        else reply('Incorrect password');

                    }
                }

            });
            //var cm = {username: request.payload.username, password: request.payload.password};
            //reply(cm);
        }

    }
});


var staticConfig = {
    auth: false,
    handler: {
        directory: {
            path: Path.join(__dirname, '/app'),
            index: true
        }
    }
};


server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }
    server.route({method: 'GET', path: '/{somethingss*}', config: staticConfig});

});
server.register([
    {
        register: require('hapi-auth-cookie')
    }
], function (err) {
    if (err) {
        console.error('Failed to load a plugin:', err);
        throw err;
    }

    // Set our server authentication strategy
    server.auth.strategy('standard', 'cookie', {
        password: 'ronmojitoronmojitoronmojitoronmojito', // cookie secret
        cookie: 'test-hapi-cookie', // Cookie name
        isHttpOnly: false,
        isSecure: false, // required for non-https applications
        ttl: 60 * 60 * 1000 // Set session to 1 hour
    });

});
server.route({
    method: 'GET',
    path: '/auth/logout',
    config: {
        auth: {strategy: 'standard',mode:'try'},
        handler: function(request, reply) {
            console.log(request.auth);
            if (request.auth.isAuthenticated) {
                request.cookieAuth.clear();
                return reply('Logout Successful!').state('userdata',{});
            }
            else{
                request.cookieAuth.clear();
                return reply('Not logged in!').state('userdata',{});
            }

        }
    }
});
server.route({
    method: 'GET',
    path: '/api/user',
    config:{
        auth: {strategy: 'standard',mode:'try'},
        handler: function (request, reply) {
            var u = {name: 'qq'};
            reply(u);
        }
    }
});

/*
server.auth.default({
    strategy: 'standard'
});
*/
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});

function querySql(sql, params, callback) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            console.log('connection error', err);
            reply('connection error ' + err)
        }
        else {
            client.query(sql, params, function (err, result) {
                if (err) {
                    console.log(err);
                    callback('insert error ' + err);
                }
                else {
                    callback(null, result);
                }
                done();

            });

        }
    });

}

function execSql(sql, params, callback) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            console.log('connection error', err);
            reply('connection error ' + err)
        }
        else {
            client.query(sql, params, function (err, result) {
                var msg = 'OK';
                if (err) {
                    console.log(err);
                    msg = 'insert error ' + err;
                }
                done();
                callback(msg);
            });

        }
    });

}

function regUser(request, reply) {
    console.log(request.payload);
    var sql = 'INSERT INTO users (username, email, password, displayname) VALUES ($1,$2,$3,$4)';
    var params = [request.payload.username, request.payload.email, request.payload.password, request.payload.displayName];
    execSql(sql, params, (msg)=> {
        if(msg == 'OK'){
            var minUserData = {
                username: request.payload.username,
                email: request.payload.email,
                displayname: request.payload.displayName
            };
            request.cookieAuth.set(minUserData);
        }
        reply(msg);
    });
}


//curl -X POST -H "Content-Type: application/json" -d '{ "username": "lksjkflksjf","password": "123456" }' -i http://comments.lobo-cano.ru/api/login
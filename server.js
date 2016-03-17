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
var Nes = require('nes');


const server = new Hapi.Server();
server.connection({port: 3041});
const cache = server.cache({ segment: 'testhapi', expiresIn: 24 * 60 * 60 * 1000 });

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
        ttl: 24 * 60 * 60 * 1000 // Set session to 1 day
    });

});

server.state('userdata', {
    ttl: 60 * 60 * 1000,
    isSecure: false,
    isHttpOnly: false,
    encoding: 'base64json',
    clearInvalid: false, // remove invalid cookies
    strictHeader: true // don't allow violations of RFC 6265
});
server.register(Nes, function (err) {

    server.route({
        method: 'GET',
        path: '/api/nes/comments',
        config: {
            handler: function (request, reply) {

                return reply('OK');
            }
        }
    });

});
server.route({
    method: 'POST',
    path: '/auth/register',
    config:{
        validate: {
            payload: {
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
    path: '/api/message',
    config:{
        auth: {strategy: 'standard'},
        validate: {
            payload: {
                message: Joi.string().min(1).max(200).required(),
                owner: Joi.number().required(),
                parent: Joi.any().optional()
            }
        },
        handler: (request, reply)=>{

            var sql = 'insert into comments (posttime, owner, message, parent) values($1,$2,$3,$4)';
            var params = [new Date(),request.payload.owner,request.payload.message,request.payload.parent];
            execSql(sql,params,(msg)=>{
                console.log(request.payload, msg);
                reply(msg);
            });

        }

    }
});
server.route({
    method: 'PUT',
    path: '/api/message',
    config:{
        auth: {strategy: 'standard'},
        validate: {
            payload: {
                message: Joi.string().min(1).max(200).required(),
                commentid: Joi.number().required(),
                owner: Joi.number().required()
            }
        },
        handler: (request, reply)=>{
            cache.get('currentuser', (err, value, cached, log) => {
                if(err){
                    console.log('cache error',err);
                    reply('cache error',err);
                    return;
                }
                if(value.userid != request.payload.owner) {
                    console.log('Current not owner!',value.userid,request.payload.owner);
                    return reply('Access denied!');
                }
                //console.log('currentuser', value.userid);
                var sql = 'update comments set message = $1 where commentid = $2';
                var params = [request.payload.message,request.payload.commentid];
                execSql(sql,params,(msg)=>{
                    //console.log(request.payload, msg);
                    reply(msg);
                });

            });
            //var cc = request.cookieAuth;
            //console.log('request.cookieAuth',cc);

        }

    }
});
server.route({
    method: 'delete',
    path: '/api/message/{id}',
    config:{
        auth: {strategy: 'standard'},
        handler: (request, reply)=>{
            cache.get('currentuser', (err, value, cached, log) => {
                if (err) {
                    console.log('cache error', err);
                    reply('cache error', err);
                    return;
                }
                var sql = 'delete from comments where commentid = $1 and owner = $2';
                var params = [request.params.id, value.userid];
                execSql(sql,params,(msg)=>{
                    console.log(request.payload, msg);
                    reply(msg);
                });

            });
                //console.log('request.params.id',request.params.id);

        }

    }
});

server.route({
    method: 'GET',
    path: '/api/messages',
    config:{
        handler: (request, reply)=>{

            var sql = 'select c.*, u.displayname from comments c join users u on c.owner = u.userid order by posttime desc';
            querySql(sql,null,(err, data)=>{
                if(err){
                    console.log(err);
                    reply({error:err,data:null});
                }
                else{
                    reply({error:null, data:toTree(data.rows)});
                    //reply({error:null, data:data.rows});
                }

            });

        }

    }
});

server.route({
    method: 'POST',
    path: '/auth/login',
    config:{
        auth: false,
        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().min(2).max(20).required()
            }
        },
        handler: function (request, reply) {
            console.log(request.payload);
            var sql = 'select * from users where email = $1';
            querySql(sql, [request.payload.email], (err, result)=> {
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
                        //console.log(usr);
                        if (request.payload.password == usr.password) {
                            var minUserData = {
                                userid: result.rows[0].userid,
                                email: usr.email,
                                displayname: usr.displayname
                            };
                            request.cookieAuth.set(minUserData);
                            cache.set('currentuser', minUserData, null, (err) => {


                            });
                            //console.log(minUserData);
                            reply({status:'OK', user: minUserData});
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
server.route({
    method: 'GET',
    path: '/auth/logout',
    config: {
        auth: {strategy: 'standard',mode:'try'},
        handler: function(request, reply) {
            //console.log(request.auth);
            if (request.auth.isAuthenticated) {
                request.cookieAuth.clear();
                return reply('Logout Successful!');
            }
            else{
                request.cookieAuth.clear();
                return reply('Not logged in!');
            }

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
    //console.log(request.payload);
    var sql = 'INSERT INTO users (email, password, displayname) VALUES ($1,$2,$3)';
    var params = [request.payload.email, request.payload.password, request.payload.displayname];
    execSql(sql, params, (msg)=> {
        if(msg == 'OK'){
            querySql('select userid from users where email = $1',[request.payload.email], (err,data)=>{
                //console.log(err,data.rows[0]);
                var minUserData = {
                    userid: data.rows[0].userid,
                    email: request.payload.email,
                    displayname: request.payload.displayname
                };
                request.cookieAuth.set(minUserData);
                //console.log('reguser',minUserData);
                reply({status:'OK', user: minUserData});
            });
        }
        else{
            reply(msg);
        }

    });
}
function toTree(plain){
    var tree = [];
    plain.forEach(function(item){
        if(!item.parent) tree.push(item);
    });
    tree.forEach(function(item){
        item.childs = plain.filter(function(c1){
            if(c1.parent == item.commentid) return c1;
        });
        item.childs.forEach(function(ch2){
            ch2.childs = plain.filter(function(c2){
                if(c2.parent == ch2.commentid) return c2;
            });
            ch2.childs.forEach(function(ch3){
                ch3.childs = plain.filter(function(c3){
                    if(c3.parent == ch3.commentid) return c3;
                });
            });
        });
    });
    return tree;
}


//curl -X POST -H "Content-Type: application/json" -d '{ "username": "lksjkflksjf","password": "123456" }' -i http://comments.lobo-cano.ru/api/login
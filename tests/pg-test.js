/**
 * Created by pablo on 14.03.16.
 */
var pg = require('pg');
var Promise = require('bluebird')
var conString = "postgres://postgres:bodeguero@localhost/postgres";
//var conString = "postgres://hapi:mensajero@localhost/testhapi";
pg.connect(conString, function (err, client, done) {
    var handleError = function (err) {
        // no error occurred, continue with the request
        if (!err) return false;

        // An error occurred, remove the client from the connection pool.
        // A truthy value passed to done will remove the connection from the pool
        // instead of simply returning it to be reused.
        // In this case, if we have successfully received a client (truthy)
        // then it will be removed from the pool.
        console.log(err);
        if (client) {
            done(client);
        }
        return true;
    };
    if (handleError(err)) return;
    client.query('INSERT INTO users (email, password, displayname) VALUES ($1,$2,$3)',
        ['user1@lobo-cano.ru', '12345678', 'Test User1'],
        function (err, result) {
            if (handleError(err)) return;
            console.log(result);
            done();
            return;
        });
});
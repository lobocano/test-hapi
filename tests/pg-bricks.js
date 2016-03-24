/**
 * Created by Gsoft on 24.03.2016.
 */
var db = require('pg-bricks').configure('postgres://postgres:bodeguero@localhost/postgres');
var Promise = require('bluebird')

var data = [
    {email: 'user1@lobo-cano.ru', password: '12345678', displayname: 'Test User1', id: 1},
    {email: 'user2@lobo-cano.ru', password: '12345678', displayname: 'Test User2', id: 1},
    {email: 'user3@lobo-cano.ru', password: '12345678', displayname: 'Test User3', id: 1}
];
var data1 = [
    {
        table: 'testpromise',
        params: {email: 'user1@lobo-cano.ru', password: '12345678', displayname: 'Test User1', id: 1}
    },
    {
        table: 'testpromise',
        params: {email: 'user2@lobo-cano.ru', password: '12345678', displayname: 'Test User2', id: 2}
    },
    {
        table: 'testpromise',
        params: {email: 'user3@lobo-cano.ru', password: '12345678', displayname: 'Test User3', id: 3}
    }
];
var data2 = [
    {
        table: 'testpromise',
        id: 1,
        params: {displayname: 'Test User11'}
    },
    {
        table: 'testpromise',
        id: 2,
        params: {displayname: 'Test User22'}
    },
    {
        table: 'testpromise',
        id: 3,
        params: {email: 'user33@lobo-cano.ru'}
    }
];
/*
 Promise.map(data, function (item) {
 db.insert('testpromise', item).returning('userid').row(function (err, row) {
 if (err) console.log('error', err)
 else {
 console.log('data', row)

 }
 });
 })
 .then((data)=> {
 console.log(data)
 })
 */

function insert(table, parameters) {
    return new Promise(function (resolve, reject) {
        console.log('PROMISEINSERT')
        function dummyCallback(err, res) {
            console.log('PROMISEINSERT ENDED',err)
            if (err) {
                console.log('error', err);
                reject(err);
            }
            else resolve(res)
        }

        db.insert(table, parameters).returning('userid').row(dummyCallback);
    })
}
function update(table, id, parameters) {
    return new Promise(function (resolve, reject) {
        console.log('Promise update start', table, id, parameters)
        function dummyCallback(err, res) {
            console.log('Promise update end',err)
            if (err) {
                console.log('error', err);
                reject(err);
            }
            else resolve(res)
        }

        db.update(table, parameters)
            .where({id: id})
            .set(parameters)
            .returning('id')
            .run(dummyCallback);
    })
}
//update
function toUpdate(item) {
    console.log('toUpdate',item.table, item.id, item.params)
    return update(item.table, item.id, item.params)
}

Promise.map(data2, toUpdate)
    .then(function () {
        console.log('COMPLETE')
    })
    .catch(function(err){
        console.log('catch',err)
    })

// insert
function toInsert(item) {
    return insert(item.table, item.params)
}
/*
Promise.map(data1, toInsert)
    .then(function () {
        console.log('COMPLETE')
    })
.catch(function(err){
    console.log('catch',err)
})
*/

/**
 * Created by pablo on 02.04.16.
 */
exports.register = function (server, options, next) {
    const api = server.select('api');
    //const db = server.app.db;

    api.route({
        method: 'GET',
        path: '/api/test',
        handler: function (req, reply) {
            console.log('route')
            const db = req.db;
            db.select().from('users').rows((err, rows)=>{
                if(err){
                    console.log(err)
                    return reply('err')
                }
                console.log(rows)
                reply(rows)
            })

        }

    })
    api.route({
        method: 'PUT',
        path: '/api/test',
        handler: function (req, reply) {
            var input = req.payload;
            console.log('route', input)
            const db = req.db;
            db.update('users', {last_update: new Date()}).where({userid: 15}).returning('userid').run((err, ret)=>{
                if(err){
                    console.log(err)
                    return reply('err')
                }
                console.log('ok', ret.rows, ret.rowCount)
                reply('updated:' + ret.rowCount)
            })

        }

    })

    next()
}

exports.register.attributes = {
    name: 'routes',
    version: '0.0.1',
}
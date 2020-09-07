
const key = "login_user"

const time = 60 * 60 * 2 //2个小时后过期

module.exports = function (app) {

    const redis = app.fs.redisClient;

    const key = "login_user"

    const time = 60 * 60 * 2 //2个小时后过期

    let services = {};


    services.login = (token, user) => {
        redis.set(key + ":" + token, JSON.stringify(user))
        redis.expire(key + ":" + token, time)
    }

    services.login_Out = (token) => {
        redis.del(key + ":" + token)
    }

    services.contains = (token) => {
        return new Promise((resolve, reject) => {
            redis.exists(key + ":" + token, (err, value) => {
                if (err) {
                    reject(err);
                }
                resolve(value)
            })
        })
    }

    services.getInfo = (token) => {
        return new Promise((resolve, reject )=>{
            redis.get(key+":"+token, (err, value) => {
                if(err){
                    reject(err);
                }
                resolve(JSON.parse(value))
            })
        })
    }


    return services;
}

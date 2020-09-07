const request = require("superagent");

class WeChat {
    constructor(opts) {
        this.opts = opts;
    }

    async getAccessToken() {
        let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.opts.appid}&secret=${this.opts.secret}`
        let res = await request.get(url)
            .set("Content-Type", "application/json");
        return res.body.access_token;
    }

    async getQrCode(token, scene) {
        let qrUrl = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${token}`
        let buffer = await request.post(qrUrl).set("Content-Type", "application/json").send({
            scene: scene
        })

        return buffer.body
    }
}



module.exports = {

    entry: function (app, router, opts) {
        const weChat = new WeChat(opts)
        app.fs = app.fs || {};
        app.fs.weChat = weChat;

        app.fs.logger.log('info', 'init weChat and inject it into app(app.fs.weChat)');
    }
};

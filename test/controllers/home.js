module.exports = {
    // 当前controller通用的preload事件-
    async onPreLoad(scope){

    },
    // 当前controller通用的prerender事件-
    async onPreRender(scope){

    },
    async index(scope){
        scope.content = 'home body';
        scope.now = +new Date;

        // 为单个action注册事件-
        this.onRenderComplete = async function(scope){

        };
    },
    async about(scope){
        let ctx = this;
        var data = {
            'company': 'Google',
            'contact': '400-110-110'
        };
        scope.content = data[ctx.get('id')];
        if(!scope.content){
            ctx.status = 404;
        }
    },
    async siteMap(scope){
        await this.render('map');
    }
};
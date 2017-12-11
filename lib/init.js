function getValue(key, kvs){
    let val = null;
    kvs.forEach(function(kv){
        if(!kv) return true;
        Object.keys(kv).forEach(function(k){
            if(k.toLowerCase()===key){
                val = kv[k];
            }
        });
    });
    return val;
}
module.exports = function (config) {
    var ctx = this;

    // 初始值为100-continue，程序判断只要不是100则不再执行后续代码-
    ctx.status = 100;
    ctx.params = {};
    ctx.scope = ctx.scope || {};

    var ctxget = ctx.get;
    ctx.get = function (key) {
        key = key.toLowerCase();

        let val = ctxget.call(this, key);
        if (!val){
            val = getValue(key, [this.query, this.params, this.body]);
        }
        return val;
    };
};
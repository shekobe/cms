// web config
;(function(w){
    if("undefined"==typeof DOMAIN_PATH||!DOMAIN_PATH) window.DOMAIN={};
    DOMAIN.CONFIG = {
        js:"http://js.360shouji.com",
        css:"http://css.360shouji.com",
        image:"http://res.360shouji.com",
        res:"http://res.360shouji.com",
        www:"http://www.360shouji.com",
        gsp:"http://grap.360shouji.com",//GRAP
        gsr:"http://po.360shouji.com",
        god:"http://god.360shouji.com",
        gos:"http://mypo.360shouji.com",
        cart:"http://cart.360shouji.com",
        item:"http://item.360shouji.com",
        set:"http://set.360shouji.com",
        rc:"http://rc.360shouji.com",
        hd:"http://hd.360shouji.com",
        stat:"http://stat.360shouji.com",
        domain:".360shouji.com",
        domainDazen:".dazen.cn",
        bbs:"http://bbs.360shouji.com",
        pay:"http://pay.360shouji.com",
        coolyun: "https://passport.qiku.com",
        checktoken: "http://usermgr.coolyun.com/UserManage/check_accesstoken"
    };
    w.getPath = function(type){
        return DOMAIN.CONFIG[type];
    }
})(window);
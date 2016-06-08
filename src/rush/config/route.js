export default[
    //路由规则匹配
    [/^rush\/(addFast_rush\.html?)?$/,"rush/index/index"],
    [/^rush\/refreshcache$/,"rush/index/refreshcache"],
    [/^rush\/(\d+)$/,"rush/index/error?status=:1"],
    //轮询查询状态
    [/^rush\/getresult$/,"rush/rush/index"]

];
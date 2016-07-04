export default[
	//路由规则匹配
	[/^error\/(\d+)(\.html?)?$/,"home/error/index?num=:1"],//错误页
    [/^help(\/|-)(\d+)(\.html?)?$/,"home/service/help?page=:2"],//服务中心
    [/^timer(\d+)?\/(\w+)?$/,"home/timer/index"],//timer
    [/^360os(\/)?(\w+)?(\/)?$/,"home/product/index?product=360os&page=:2"],//360os   
    [/^(product|zt)\/(\w+)?(\/)?(\w+)?(.html?)?$/,"home/product/index?product=:2&page=:4"],//产品展示
    [/^about(\/)?(\w+)?(\.html?)?$/,"home/service/about?page=:2"],//关于
    [/^service\/(\w+)(\.html?)?$/,"home/service/common?type=:1"],//服务

    //新闻
    [/^news\/(\w+)(\.html?)?$/,"home/news/preview?articleid=:1"],

];
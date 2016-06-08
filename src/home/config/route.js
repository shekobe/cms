export default[
	//路由规则匹配
	[/^error\/(\d+)(\.html?)?$/,"home/error/index?num=:1"],
    [/^help(\/|-)(\d+)(\.html?)?$/,"home/service/help?page=:2"],
    [/^timer(\d+)?\/(\w+)?$/,"home/timer/index"],

];
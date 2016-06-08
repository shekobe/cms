;(function(window){

if(typeof detector  == undefined)
   window.detector = {};

var NA_VERSION = "-1",
    external,
    re_msie = /\b(?:msie |ie |trident\/[0-9].*rv[ :])([0-9.]+)/;

function toString(object){
  return Object.prototype.toString.call(object);
}
function isObject(object){
  return toString(object) === "[object Object]";
}
function isFunction(object){
  return toString(object) === "[object Function]";
}
function each(object, factory, argument){
  for(var i=0,b,l=object.length; i<l; i++){
    if(factory.call(object, object[i], i) === false){break;}
  }
}

// 硬件设备信息识别表达式。
// 使用数组可以按优先级排序。
var DEVICES = [
  ["nokia", function(ua){
    // 不能将两个表达式合并，因为可能出现 "nokia; nokia 960"
    // 这种情况下会优先识别出 nokia/-1
    if(ua.indexOf("nokia ") !== -1){
      return /\bnokia ([0-9]+)?/;
    }else if(ua.indexOf("noain") !== -1){
      return /\bnoain ([a-z0-9]+)/;
    }else{
      return /\bnokia([a-z0-9]+)?/;
    }
  }],
  // 三星有 Android 和 WP 设备。
  ["samsung", function(ua){
    if(ua.indexOf("samsung") !== -1){
      return /\bsamsung(?:\-gt)?[ \-]([a-z0-9\-]+)/;
    }else{
      return /\b(?:gt|sch)[ \-]([a-z0-9\-]+)/;
    }
  }],
  ["wp", function(ua){
    return ua.indexOf("windows phone ") !== -1 ||
      ua.indexOf("xblwp") !== -1 ||
      ua.indexOf("zunewp") !== -1 ||
      ua.indexOf("windows ce") !== -1;
  }],
  ["pc", "windows"],
  ["ipad", "ipad"],
  // ipod 规则应置于 iphone 之前。
  ["ipod", "ipod"],
  ["iphone", /\biphone\b|\biph(\d)/],
  ["mac", "macintosh"],
  ["mi", /\bmi[ \-]?([a-z0-9 ]+(?= build))/],
  ["aliyun", /\baliyunos\b(?:[\-](\d+))?/],
  ["meizu", /\b(?:meizu\/|m)([0-9]+)\b/],
  ["nexus", /\bnexus ([0-9s.]+)/],
  ["huawei", function(ua){
    var re_mediapad = /\bmediapad (.+?)(?= build\/huaweimediapad\b)/;
    if(ua.indexOf("huawei-huawei") !== -1){
      return /\bhuawei\-huawei\-([a-z0-9\-]+)/;
    }else if(re_mediapad.test(ua)){
      return re_mediapad;
    }else{
      return /\bhuawei[ _\-]?([a-z0-9]+)/;
    }
  }],
  ["lenovo", function(ua){
    if(ua.indexOf("lenovo-lenovo") !== -1){
      return /\blenovo\-lenovo[ \-]([a-z0-9]+)/;
    }else{
      return /\blenovo[ \-]?([a-z0-9]+)/;
    }
  }],
  // 中兴
  ["zte", function(ua){
    if(/\bzte\-[tu]/.test(ua)){
      return /\bzte-[tu][ _\-]?([a-su-z0-9\+]+)/;
    }else{
      return /\bzte[ _\-]?([a-su-z0-9\+]+)/;
    }
  }],
  // 步步高
  ["vivo", /\bvivo(?: ([a-z0-9]+))?/],
  ["htc", function(ua){
    if(/\bhtc[a-z0-9 _\-]+(?= build\b)/.test(ua)){
      return /\bhtc[ _\-]?([a-z0-9 ]+(?= build))/;
    }else{
      return /\bhtc[ _\-]?([a-z0-9 ]+)/;
    }
  }],
  ["oppo", /\boppo[_]([a-z0-9]+)/],
  ["konka", /\bkonka[_\-]([a-z0-9]+)/],
  ["sonyericsson", /\bmt([a-z0-9]+)/],
  ["coolpad", /\bcoolpad[_ ]?([a-z0-9]+)/],
  ["lg", /\blg[\-]([a-z0-9]+)/],
  ["android", /\bandroid\b|\badr\b/],
  ["blackberry", "blackberry"]
];
// 操作系统信息识别表达式
var OS = [
  ["wp", function(ua){
    if(ua.indexOf("windows phone ") !== -1){
      return /\bwindows phone (?:os )?([0-9.]+)/;
    }else if(ua.indexOf("xblwp") !== -1){
      return /\bxblwp([0-9.]+)/;
    }else if(ua.indexOf("zunewp") !== -1){
      return /\bzunewp([0-9.]+)/;
    }
    return "windows phone";
  }],
  ["windows", /\bwindows nt ([0-9.]+)/],
  ["macosx", /\bmac os x ([0-9._]+)/],
  ["ios", function(ua){
    if(/\bcpu(?: iphone)? os /.test(ua)){
      return /\bcpu(?: iphone)? os ([0-9._]+)/;
    }else if(ua.indexOf("iph os ") !== -1){
      return /\biph os ([0-9_]+)/;
    }else{
      return /\bios\b/;
    }
  }],
  ["yunos", /\baliyunos ([0-9.]+)/],
  ["android", function(ua){
    if(ua.indexOf("android") >= 0){
      return /\bandroid[ \/-]?([0-9.x]+)?/;
    }else if(ua.indexOf("adr") >= 0){
      if(ua.indexOf("mqqbrowser") >= 0){
        return /\badr[ ]\(linux; u; ([0-9.]+)?/;
      }else{
        return /\badr(?:[ ]([0-9.]+))?/;
      }
    }
    return "android";
    //return /\b(?:android|\badr)(?:[\/\- ](?:\(linux; u; )?)?([0-9.x]+)?/;
  }],
  ["chromeos", /\bcros i686 ([0-9.]+)/],
  ["linux", "linux"],
  ["windowsce", /\bwindows ce(?: ([0-9.]+))?/],
  ["symbian", /\bsymbian(?:os)?\/([0-9.]+)/],
  ["blackberry", "blackberry"]
];

/*
 * 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
 * @param {String} ua, userAgent string.
 * @return {Object}
 */
function IEMode(ua){
  if(!re_msie.test(ua)){return null;}

  var m,
      engineMode, engineVersion,
      browserMode, browserVersion,
      compatible=false;

  // IE8 及其以上提供有 Trident 信息，
  // 默认的兼容模式，UA 中 Trident 版本不发生变化。
  if(ua.indexOf("trident/") !== -1){
    m = /\btrident\/([0-9.]+)/.exec(ua);
    if(m && m.length>=2){
      // 真实引擎版本。
      engineVersion = m[1];
      var v_version = m[1].split(".");
      v_version[0] = parseInt(v_version[0], 10) + 4;
      browserVersion = v_version.join(".");
    }
  }

  m = re_msie.exec(ua);
  browserMode = m[1];
  var v_mode = m[1].split(".");
  if("undefined" === typeof browserVersion){
    browserVersion = browserMode;
  }
  v_mode[0] = parseInt(v_mode[0], 10) - 4;
  engineMode = v_mode.join(".");
  if("undefined" === typeof engineVersion){
    engineVersion = engineMode;
  }

  return {
    browserVersion: browserVersion,
    browserMode: browserMode,
    engineVersion: engineVersion,
    engineMode: engineMode,
    compatible: engineVersion !== engineMode
  };
}
/**
 * 针对同源的 TheWorld 和 360 的 external 对象进行检测。
 * @param {String} key, 关键字，用于检测浏览器的安装路径中出现的关键字。
 * @return {Undefined,Boolean,Object} 返回 undefined 或 false 表示检测未命中。
 */
function checkTW360External(key){
  if(!external){return;} // return undefined.
  try{
    //        360安装路径：
    //        C:%5CPROGRA~1%5C360%5C360se3%5C360SE.exe
    var runpath = external.twGetRunPath.toLowerCase();
    // 360SE 3.x ~ 5.x support.
    // 暴露的 external.twGetVersion 和 external.twGetSecurityID 均为 undefined。
    // 因此只能用 try/catch 而无法使用特性判断。
    var security = external.twGetSecurityID(window);
    var version = external.twGetVersion(security);

    if(runpath && runpath.indexOf(key) === -1){return false;}
    if(version){return {version: version};}
  }catch(ex){}
}

var ENGINE = [
  ["trident", re_msie],
  //["blink", /blink\/([0-9.+]+)/],
  ["webkit", /\bapplewebkit[\/]?([0-9.+]+)/],
  ["gecko", /\bgecko\/(\d+)/],
  ["presto", /\bpresto\/([0-9.]+)/],
  ["androidwebkit", /\bandroidwebkit\/([0-9.]+)/],
  ["coolpadwebkit", /\bcoolpadwebkit\/([0-9.]+)/],
  ["u2", /\bu2\/([0-9.]+)/],
  ["u3", /\bu3\/([0-9.]+)/]
];
var BROWSER = [
  // Sogou.
  ["sg", / se ([0-9.x]+)/],
  // TheWorld (世界之窗)
  // 由于裙带关系，TW API 与 360 高度重合。
  // 只能通过 UA 和程序安装路径中的应用程序名来区分。
  // TheWorld 的 UA 比 360 更靠谱，所有将 TheWorld 的规则放置到 360 之前。
  ["tw", function(ua){
    var x = checkTW360External("theworld");
    if(typeof x !== "undefined"){return x;}
    return "theworld";
  }],
  // 360SE, 360EE.
  ["360", function(ua) {
    var x = checkTW360External("360se");
    if(typeof x !== "undefined"){return x;}
    if(ua.indexOf("360 aphone browser") !== -1){
      return /\b360 aphone browser \(([^\)]+)\)/;
    }
    return /\b360(?:se|ee|chrome|browser)\b/;
  }],
  // Maxthon
  ["mx", function(ua){
    try{
      if(external && (external.mxVersion || external.max_version)){
        return {
          version: external.mxVersion || external.max_version
        };
      }
    }catch(ex){}
    return /\bmaxthon(?:[ \/]([0-9.]+))?/;
  }],
  ["qq", /\bm?qqbrowser\/([0-9.]+)/],
  ["green", "greenbrowser"],
  ["tt", /\btencenttraveler ([0-9.]+)/],
  ["lb", function(ua){
    if(ua.indexOf("lbbrowser") === -1){return false;}
    var version;
    try{
      if(external && external.LiebaoGetVersion){
        version = external.LiebaoGetVersion();
      }
    }catch(ex){}
    return {
      version: version || NA_VERSION
    };
  }],
  ["tao", /\btaobrowser\/([0-9.]+)/],
  ["fs", /\bcoolnovo\/([0-9.]+)/],
  ["sy", "saayaa"],
  // 有基于 Chromniun 的急速模式和基于 IE 的兼容模式。必须在 IE 的规则之前。
  ["baidu", /\bbidubrowser[ \/]([0-9.x]+)/],
  // 后面会做修复版本号，这里只要能识别是 IE 即可。
  ["ie", re_msie],
  ["mi", /\bmiuibrowser\/([0-9.]+)/],
  // Opera 15 之后开始使用 Chromniun 内核，需要放在 Chrome 的规则之前。
  ["opera", function(ua){
    var re_opera_old = /\bopera.+version\/([0-9.ab]+)/;
    var re_opera_new = /\bopr\/([0-9.]+)/;
    return re_opera_old.test(ua) ? re_opera_old : re_opera_new;
  }],
  ["yandex", /yabrowser\/([0-9.]+)/],
  // 支付宝手机客户端
  ["ali-ap", function(ua){
    if(ua.indexOf("aliapp") > 0){
      return /\baliapp\(ap\/([0-9.]+)\)/;
    }else{
      return /\balipayclient\/([0-9.]+)\b/;
    }
  }],
  // 支付宝平板客户端
  ["ali-ap-pd", /\baliapp\(ap-pd\/([0-9.]+)\)/],
  // 支付宝商户客户端
  ["ali-am", /\baliapp\(am\/([0-9.]+)\)/],
  // 淘宝手机客户端
  ["ali-tb", /\baliapp\(tb\/([0-9.]+)\)/],
  // 淘宝平板客户端
  ["ali-tb-pd", /\baliapp\(tb-pd\/([0-9.]+)\)/],
  // 天猫手机客户端
  ["ali-tm", /\baliapp\(tm\/([0-9.]+)\)/],
  // 天猫平板客户端
  ["ali-tm-pd", /\baliapp\(tm-pd\/([0-9.]+)\)/],
  ["chrome", / (?:chrome|crios|crmo)\/([0-9.]+)/],
  // UC 浏览器，可能会被识别为 Android 浏览器，规则需要前置。
  ["uc", function(ua){
    if(ua.indexOf("ucbrowser/") >= 0){
      return /\bucbrowser\/([0-9.]+)/;
    }else if(/\buc\/[0-9]/.test(ua)){
      return /\buc\/([0-9.]+)/;
    }else if(ua.indexOf("ucweb") >= 0){
      // `ucweb/2.0` is compony info.
      // `UCWEB8.7.2.214/145/800` is browser info.
      return /\bucweb([0-9.]+)?/;
    }else{
      return /\b(?:ucbrowser|uc)\b/;
    }
  }],
  // Android 默认浏览器。该规则需要在 safari 之前。
  ["android", function(ua){
    if(ua.indexOf("android") === -1){return;}
    return /\bversion\/([0-9.]+(?: beta)?)/;
  }],
  ["safari", /\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//],
  // 如果不能被识别为 Safari，则猜测是 WebView。
  ["webview", /\bcpu(?: iphone)? os (?:[0-9._]+).+\bapplewebkit\b/],
  ["firefox", /\bfirefox\/([0-9.ab]+)/],
  ["nokia", /\bnokiabrowser\/([0-9.]+)/]
];

/**
 * UserAgent Detector.
 * @param {String} ua, userAgent.
 * @param {Object} expression
 * @return {Object}
 *    返回 null 表示当前表达式未匹配成功。
 */
function detect(name, expression, ua){
  var expr = isFunction(expression) ? expression.call(null, ua) : expression;
  if(!expr){return null;}
  var info = {
    name: name,
    version: NA_VERSION,
    codename: ""
  };
  var t = toString(expr);
  if(expr === true){
    return info;
  }else if(t === "[object String]"){
    if(ua.indexOf(expr) !== -1){
      return info;
    }
  }else if(isObject(expr)){ // Object
    if(expr.hasOwnProperty("version")){
      info.version = expr.version;
    }
    return info;
  }else if(expr.exec){ // RegExp
    var m = expr.exec(ua);
    if(m){
      if(m.length >= 2 && m[1]){
        info.version = m[1].replace(/_/g, ".");
      }else{
        info.version = NA_VERSION;
      }
      return info;
    }
  }
}

var na = {name:"na", version:NA_VERSION};
// 初始化识别。
function init(ua, patterns, factory, detector){
  var detected = na;
  each(patterns, function(pattern){
    var d = detect(pattern[0], pattern[1], ua);
    if(d){
      detected = d;
      return false;
    }
  });
  factory.call(detector, detected.name, detected.version);
}

/**
 * 解析 UserAgent 字符串
 * @param {String} ua, userAgent string.
 * @return {Object}
 */
var parse = function(ua){
  ua = (ua || "").toLowerCase();
  var d = {};

  init(ua, DEVICES, function(name, version){
    var v = parseFloat(version);
    d.device = {
      name: name,
      version: v,
      fullVersion: version
    };
    d.device[name] = v;
  }, d);

  init(ua, OS, function(name, version){
    var v = parseFloat(version);
    d.os = {
      name: name,
      version: v,
      fullVersion: version
    };
    d.os[name] = v;
  }, d);

  var ieCore = IEMode(ua);

  init(ua, ENGINE, function(name, version){
    var mode = version;
    // IE 内核的浏览器，修复版本号及兼容模式。
    if(ieCore){
      version = ieCore.engineVersion || ieCore.engineMode;
      mode = ieCore.engineMode;
    }
    var v = parseFloat(version);
    d.engine = {
      name: name,
      version: v,
      fullVersion: version,
      mode: parseFloat(mode),
      fullMode: mode,
      compatible: ieCore ? ieCore.compatible : false
    };
    d.engine[name] = v;
  }, d);

  init(ua, BROWSER, function(name, version){
    var mode = version;
    // IE 内核的浏览器，修复浏览器版本及兼容模式。
    if(ieCore){
      // 仅修改 IE 浏览器的版本，其他 IE 内核的版本不修改。
      if(name === "ie"){
        version = ieCore.browserVersion;
      }
      mode = ieCore.browserMode;
    }
    var v = parseFloat(version);
    d.browser = {
      name: name,
      version: v,
      fullVersion: version,
      mode: parseFloat(mode),
      fullMode: mode,
      compatible: ieCore ? ieCore.compatible : false
    };
    d.browser[name] = v;
  }, d);
  return d;
};


// NodeJS.
if(typeof process === "object" && process.toString() === "[object process]"){

  // 加载更多的规则。
  var morerule = module["require"]("./morerule");
  [].unshift.apply(DEVICES, morerule.DEVICES || []);
  [].unshift.apply(OS,      morerule.OS      || []);
  [].unshift.apply(BROWSER, morerule.BROWSER || []);
  [].unshift.apply(ENGINE,  morerule.ENGINE  || []);

}else{

  var userAgent = navigator.userAgent || "";
  //var platform = navigator.platform || "";
  var appVersion = navigator.appVersion || "";
  var vendor = navigator.vendor || "";
  external = window.external;

  detector = parse(userAgent + " " + appVersion + " " + vendor);
  window.detector = detector;

}


// exports `parse()` API anyway.
detector.parse = parse;

//module.exports = detector;
})(window);
//监控
;(function(window,server_url,monitoring) {
  if(window.monitor){return;}

  var M = window.monitor = {};
  M._DATAS = [];

  var lost_resources = [];
  var _lost_resources = {};
  /**
   * 客户端资源加载失败时调用这个接口。
   */
  M.lost = function(uri){
    if(_lost_resources.hasOwnProperty(uri)){return;}
    _lost_resources[uri] = true;
    lost_resources.push(uri);
  };

  /**
   * 通用监控接口。
   * @param {String} seed, 监控点。
   * @param {String} profile, 监控类型，默认为 `log`。
   * @return {Object}
   */
  M.log = function(seed, profile){
    if(!seed){return;}
    var p = profile || "log";

    // 兼容老版对产品监控的支持。
    // if(arguments.length === 3){
    //   p = "product";
    //   seed = Array.prototype.join.call(arguments,"|");
    // }
    var data = {
      profile: p,
      seed: String(seed)
    };
    M._DATAS.push(data);
    return data;
  };

  var RE_FUNCTION = /^function\b[^\)]+\)/;
  /**
   * 获得函数名。
   * @param {Function} func, 函数对象。
   * @return {String} 函数名。
   */
  function function_name(func){
    var match = String(func).match(RE_FUNCTION);
    return match ? match[0] : "";
  }

  /**
   * 函数调用堆栈。
   * XXX: 匿名函数的支持。
   * @param {Function} call, function's caller.
   * @return {String} stack trace.
   */
  function stacktrace(call){
    var stack = [];

    while(call.arguments && call.arguments.callee && call.arguments.callee.caller){
      call = call.arguments.callee.caller;
      stack.push("at " + function_name(call));

      // Because of a bug in Navigator 4.0, we need this line to break.
      // c.caller will equal a rather than null when we reach the end
      // of the stack. The following line works around this.
      if (call.caller === call){break;}
    }
    return stack.join("\n");
  }

  /**
   * JavaScript 异常统一处理函数。
   * @param {String} message, 异常消息。
   * @param {String} file, 异常所在文件。
   * @param {Number} line, 异常所在行。
   * @param {Number,String} number, 异常编码，IE 支持。
   * @return {Object} 主要用于单元测试，本身可以不返回。
   */
  function error(message, file, line, number, stack){
    if(!stack && arguments.callee.caller){
      stack = stacktrace(arguments.callee.caller);
    }
    var data = {
      profile: "jserror",
      msg: message || "",
      file: file || "",
      line: line || 0,
      num: number || "",
      stack: stack || "",
      lost: lost_resources.join(",")
    };
    M._DATAS.push(data);
    return data;
  }

  /**
   * JavaScript 异常接口，用于监控 `try/catch` 中被捕获的异常。
   * @param {Error} err, JavaScript 异常对象。
   * @return {Object} 主要用于单元测试。
   */
  M.error = function(ex){
    if (!(ex instanceof Error)) {return;}
    var stack = ex.stack || ex.stacktrace;
    return error(
      ex.message || ex.description,
      ex.fileName,
      ex.lineNumber || ex.line,
      ex.number,
      stack
    );
  };

  /**
   * 全局 JavaScript 异常监控。
   * @return {Boolean} 返回 `true` 则控制台捕获异常。
   *                   返回 `false` 则控制台不捕获异常。
   *                   建议返回 `false`。
   */
  window.onerror = function(message, file, line) {
    error(message, file, line);
    return false;
  };


  var win = window;
  var doc = document;
  var loc = window.location;
  var M = win.monitor;

  // 避免未引用先行脚本抛出异常。
  if(!win.monitor){
    M = window.monitor = {};
    M._DATAS = [];
  }

  //var detector = require("detector");

  // 数据通信规范的版本。
  var version = "1.0";
  var LOG_SERVER = server_url|| "http://www.360shouji.com/fejstrack/";
  var URLLength = detector.engine.trident ? 2083 : 8190;
  var url = path(loc.href);
  // 是否启用监控。
  // 采样命中后调用 boot() 方法修改为 true 后开发发送监控数据。
  //var monitoring = open_jstrack;

  // UTILS -------------------------------------------------------

  function typeOf(obj){
    return Object.prototype.toString.call(obj);
  }

  /**
   * 深度复制 JavaScript 对象。
   *
   * @param {Object} obj, 被复制的对象。
   * @return {Object} obj 副本。
   */
  function clone(obj){
    var ret;
    if(null === obj){return null;}
    switch(typeOf(obj)){
    case "[object String]":
    case "object Number":
    case "[object Boolean]":
      ret = obj;
      break;
    case "[object Array]":
      ret = [];
      //ret = Array.prototype.slice.call(obj, 0);
      for(var i=obj.length-1; i>=0; i--){
        ret[i] = clone(obj[i]);
      }
      break;
    case "[object RegExp]":
      ret = new RegExp(obj.source, (obj.ignoreCase ? "i" : "")+
        (obj.global ? "g" : "") + (obj.multiline ? "m" : ""));
      break;
    case "[object Date]":
      ret = new Date(obj.valueOf());
      break;
    case "[object Error]":
      obj = ret;
      break;
    case "[object Object]":
      ret = {};
      for(var k in obj){
        if(has(obj, k)){
          ret[k] = clone(obj[k]);
        }
      }
      break;
    default:
      throw new Error("Not support the type.");
    }
    return ret;
  }

  /**
   * 合并 object 对象的属性到 target 对象。
   *
   * @param {Object} target, 目标对象。
   * @param {Object} object, 来源对象。
   * @return {Object} 返回目标对象，目标对象附带有来源对象的属性。
   */
  function merge(target, object){
    if(!object){return target;}
    for(var k in object){
      if(has(object, k)){
        target[k] = object[k];
      }
    }
    return target;
  }

  /**
   * 获得资源的路径（不带参数和 hash 部分）
   * 另外新版 Arale 通过 nginx 提供的服务，支持类似：
   * > https://static.alipay.com/ar??arale.js,a.js,b.js
   * 的方式请求资源，需要特殊处理。
   *
   * @param {String} uri, 仅处理绝对路径。
   * @return {String} 返回 uri 的文件路径，不包含参数和 jsessionid。
   */
  function path(uri){
    if(undefined === uri || typeof(uri) !== "string"){return "";}
    var idx = uri.indexOf(";jsessionid=");
    if(idx >= 0){return uri.substr(0, idx);}

    // white-list for min services.
    // if(uri.indexOf("/min/?")>=0){
    //   return uri;
    // }

    do{
      idx = uri.indexOf("?", idx);
      if(idx < 0){break;}
      if("?" === uri.charAt(idx+1)){
        idx += 2;
      }else{
        break;
      }
    }while(idx >= 0);

    return idx < 0 ? uri : uri.substr(0, idx);
  }

  //function innerText(elem){
    //if(!elem){return "";}
    //return elem.innerText || elem.textContent || "";
  //}

  // 将对象转为键值对参数字符串。
  function param(obj){
    if(Object.prototype.toString.call(obj) !== "[object Object]"){
      return "";
    }
    var p = [];
    for(var k in obj){
      if(!has(obj,k)){continue;}
      if(typeOf(obj[k]) === "[object Array]"){
        for(var i=0,l=obj[k].length; i<l; i++){
          // TODO: var encode = encodeURIComponent;
          p.push(k + "=" + encodeURIComponent(obj[k][i]));
        }
      }else{
        p.push(k + "=" + encodeURIComponent(obj[k]));
      }
    }
    return p.join("&");
  }

  function has(obj, key){
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  // /UTILS -------------------------------------------------------

  //function serverNumber(){
    //var servName = doc.getElementById("ServerNum");
    //servName = innerText(servName).split("-");
    //servName = servName[0] || loc.hostname;
    //return servName;
  //}

  var DEFAULT_DATA = {
    url: url,
    ref: doc.referrer || "-",
    //sys: servName,
    clnt: detector.device.name+"/"+detector.device.fullVersion+"|"+
      detector.os.name+"/"+detector.os.fullVersion+"|"+
      detector.browser.name+"/"+detector.browser.fullVersion+"|"+
      detector.engine.name+"/"+detector.engine.fullVersion +"|"+
      screen.width+"*"+screen.height+"/"+screen.pixelDepth
    // ua: detector
  };


  /**
   * 创建图片请求发送数据。
   *
   * @param {String} url, 日志服务器 URL 地址。
   * @param {Object} data, 附加的监控数据。
   * @param {Function} callback
   */
  function send(host, data, callback){
    if(!callback){callback = function(){};}
    if(!data){return callback();}

    var d = param(data);
    var url = host + (host.indexOf("?") < 0 ? "?" : "&") + d;
    // 忽略超长 url 请求，避免资源异常。
    if(url.length > URLLength){return callback();}

    // @see http://www.javascriptkit.com/jsref/image.shtml
    var img = new Image(1,1);
    img.onload = img.onerror = img.onabort = function(){
      callback();
      img.onload = img.onerror = img.onabort = null;
      img = null;
    };

    img.src = url;
  }

  var sending = false;
  /**
   * 分时发送队列中的数据，避免 IE(6) 的连接请求数限制。
   */
  function timedSend(){
    if(!monitoring || sending){return;}

    var e = M._DATAS.shift();
    if(!e){return;}
    sending = true;

    var data = clone(DEFAULT_DATA);
    // 理论上应该在收集异常消息时修正 file，避免连接带有参数。
    // 但是收集部分在 seer 中，不适合放置大量的脚本。
    if(e.profile === "jserror"){
      e.file = path(e.file);
    }
    data = merge(data, e);
    data.time = 1*new Date(); // 避免缓存。
    send(LOG_SERVER, data, function(){
      sending = false;
      timedSend();
    });
  }

  // timedSend 准备好后可以替换 push 方法，自动分时发送。
  var _push = M._DATAS.push;
  M._DATAS.push = function(){
    _push.apply(M._DATAS, arguments);
    timedSend();
  };

  /**
   * 启动监控进程，开始发送数据。
   * @param {Boolean} state, 启动状态标识。
   *    为 `false` 时停止监控。
   *    否则启动监控。
   */
  M.boot = function(state){
    monitoring = (state !== false);
  };

  window.monitor = M;
})(window,'http://101.198.161.105/fejstrack/',true);//请求发送地址

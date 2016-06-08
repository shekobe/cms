//Cross-site request forgery 跨站请求伪造
export default {
  session_name: "qkToken", // Token 值存在 session 的名字
  form_name: "qktoken", // CSRF 字段名字，从该字段获取值校验
  errno: 400, //错误号
  errmsg: "token error" // 错误信息
};

application created by [ThinkJS](http://www.thinkjs.org)
## ./mongorestore -h 10.100.7.18 -d qiku /app/mongodb/sugy/qiku -u qiku -p 123456 还原
## install dependencies

```
npm install
```

## start server

```
npm start
```

## deploy with pm2

use pm2 to deploy app on production envrioment.

```
pm2 startOrReload pm2.json
```

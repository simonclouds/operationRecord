//引入mysql组件
const mysql = require('mysql');
//引入mysql配置
const databaseConfig = require('./mysql.config');
//加载mysql配置
var connection = mysql.createConnection(databaseConfig);
//连接mysql
connection.connect();
//exports
module.exports = {
  /**
   * 查询条数
   * @param {表名} Table 
   * @param {页码，从1开始} page 
   * @param {每页条数，默认10条} pageSize 
   */
  query: function (Table, page, pageSize = 10) {
    const start = (page - 1) * pageSize;
    const sql = `SELECT * FROM ${Table} limit ${start},${pageSize}`;
    //查询条数
    const count = `SELECT COUNT(*) FROM ${Table}`;
    //promise 便于调用
    const p = new Promise(function (res, rej) {
      connection.query(count, function (err, totalSize) {
        if (err) {
          rej(err.message);
        } else {
          connection.query(sql, function (err, list) {
            if (err) {
              rej(err.message);
            } else {
              /**
               * list 查询的数据
               * totalSize 总条数
               */
              res({
                list,
                totalSize: totalSize[0]['COUNT(*)']
              });
            };
          });
        };
      });
    });
    //查
    return p;
  },
  /**
   * 添加数据
   * @param {[操作人姓名,上传ip,上传时间,文件名,是否认为上报,留言信息]} params 
   * @param {表名} table 
   */
  add: function (params = ['', '', '', '', '', '', ''], table) {
    var addSql = `INSERT INTO ${table}(Id,name,ip,date,dataFile,msg,emotion,isReport) VALUES(0,?,?,?,?,?,?,?)`;
    const p = new Promise(function (res, rej) {
      connection.query(addSql, params, function (err, result) {
        if (err) {
          rej(err.message);
        } else {
          res(result);
        };
      });
    });
    return p;
  },
  getAllTables: function () {
    const getAllTables = `SELECT table_name FROM information_schema.tables WHERE table_schema = '${databaseConfig.database}'`;
    const p = new Promise(function (res, rej) {
      connection.query(getAllTables, function (err, result) {
        if (err) {
          rej(err.message);
        } else {
          res(result);
        };
      });
    });
    return p;
  }
};
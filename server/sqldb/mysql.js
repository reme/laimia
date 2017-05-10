var mysql=require('mysql');
var pool=mysql.createPool({
	host:'10.66.116.209',
	user:'reme',
	password:'laowang60',
	database:'test',
	port:3306
});

var query=function(sql,param,callback){
	pool.getConnection(function(err,conn){
		if(err){
			callback(err,null,null);
		}else{
			conn.query(sql,param,function(qerr,vals,fields){
				conn.release();
				callback(qerr,vals,fields);
				});
			}
		});
};
module.exports=query;

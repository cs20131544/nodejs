/*
 * 2018/3/23 Kyuho Kim
 * ekyuho@gmail.com
 * GET으로 호출하는 경우.
 * http://localhost:8083/data
 */

var express = require('express');
var app = express();
var http = require('http');
var json2csv = require('json2csv');
const fs = require('fs');



mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'mypassword',
    database: 'mydb'
})
connection.connect();

/*
   function insert_sensor(device,unit,type,value,seq,ip)
   {
   obj={}
   obj.seq=seq
   obj.device=device
   obj.unit=unit
   obj.type=type
   obj.value=value
   obj.ip = ip.replace(/^.*:/, '')

   var query=connection.query('insert into sensors set?',obj,function(err,rows,cols){
   console.log("database insertion ok= %j",obj)
   })
   }
 */
/*
   app.get('/log',function(req,res){
   r = req.query
   console.log("GET %j",r)

   insert_sensor(r,device,r.unit,r.type,r.value,r.seq,req.connection.remoteAddress)
   res.end('OK'+JSON.stringfy(req.query))

   })
 */



app.get("/data", function(req, res) {
    console.log("param=" + req.query);

    var qstr = 'select * from sensors ';
    connection.query(qstr, function(err, rows, cols) {
        if (err) {
            throw err;
            res.send('query error: '+ qstr);
            return;
        }

        console.log("Got "+ rows.length +" records");
        html = ""
            for (var i=0; i< rows.length; i++) {
                html += JSON.stringify(rows[i]);
            }
        res.send(html);
    });

});
/*
app.get('/download', function(req, res){
    var file = fs.createWriteStream("data.csv");
    var request = http.get("http://163.239.76.213/data",function(response){respeonse.pipe(file)})
        res.download(file); // Set disposition and send it.
});*/



app.get('/download', (req, res) => {
    console.log('start download');

    var qstr = 'select * from sensors';
    var query = connection.query(qstr, function(err, rows)
            {
                /*
                if(err)
                {
                    throw err;
                    res.send('query error: ' + qstr);
                    return;
                }*/
                var output = json2csv.parse(rows);
                res.attachment('data.csv');
                res.status(200).send(output);
            });
});
var server = app.listen(8083, function () {
    var host = server.address().address
        var port = server.address().port
        console.log('listening at http://%s:%s', host, port)
});

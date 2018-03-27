const express = require('express');
const app = express();
const fs = require('fs')

app.get('/get',function(req,res){
        var text = fs.readFileSync("log.txt",'utf8');
        console.log(text);
        res.end(text)
})
app.listen(8080,function(){
        console.log("Listening!");

});

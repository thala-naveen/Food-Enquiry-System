var express = require('express');
var router = express.Router();
var pool = require('./pool');
var LocalStorage = require('node-localstorage').LocalStorage
var localstorage = new LocalStorage('./scratch');


router.post('/checklogin',function(req,res){
    pool.query('select * from food.admin where emailid=? and password=?',[req.body.mail,req.body.pass],function(error,result){

        if(error)
        {
            console.log(error);
            res.render('loginpage',{msg:'server error'})
        }
        else
        {
            if(result.length==1)
            {
                console.log(result);
                localstorage.setItem('admin',JSON.stringify({emailid:result[0].emailid}))
                res.render('dashboard',{result:result[0]})
            }
            else
            {
                res.render('loginpage',{msg:'invalid email/password'})
            }
        }
    })
})

router.get('/loginpage',function(req,res){
    res.render('loginpage',{msg:''})
})

module.exports = router;

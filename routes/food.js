var express = require('express');
var pool = require('./pool');
var router = express.Router();
var multer=require('./multer');
const upload = require('./multer');
var fs=require('fs');
const e = require('express');
var LocalStorage = require('node-localstorage').LocalStorage
var localstorage = new LocalStorage('./scratch');

router.get('/go',function(req,res){
    res.redirect('/food/search')
})

router.get('/logs',function(req,res){
    res.redirect('/admin/loginpage')
})


router.get('/searchfood',function(req,res){
    pool.query('select F.*,(select a.foodname from foods a where a.foodid=F.foodnameid) as fn,(select b.categoryname from foodtype b where b.categoryid=F.categorynameid) as cn from foodlist F where F.categorynameid=? and F.foodnameid=?',[req.query.cid,req.query.fid],function(error,result){
        console.log(req.query);
        if(error)
        {
            console.log(error);
            res.status(500).json([])
        }
        else
        {
            console.log(result);
            res.status(200).json(result)
        }
    })
})

router.get('/search',function(req,res,next){
    res.render('searchfood')
})

router.get('/logout',function(req,res){
    localstorage.clear
    res.render('loginpage')
})


router.post('/editpicture',upload.single('file'),function(req,res){
   console.log(req.file,req.body);
   
    pool.query('update foodlist set file=? where foodlistid=?',[req.file.originalname,req.body.foodlistid],function(error,result){

        if(error)
        {
            console.log(error);
            res.redirect('/food/displayall')
        }
        else
        {
            console.log(result);
            fs.unlinkSync('D:/sandeep_sir/practice/foodsystem/public/images/'+req.body.oldpic)
            res.redirect('/food/displayall')
        }
    })
})

router.get('/showpic',function(req,res){
    res.render('showpic',{foodlistid:req.query.foodlistid,foodname:req.query.foodname,pic:req.query.file})
})

router.post('/editdeleterecord',function(req,res){
    if(req.body.btn=="Edit")
    {
        console.log(req.body);
    console.log(req.file);
    
    var foodlist   
        foodlist=req.body.foodlist
   

    var ingredients   
        ingredients=req.body.ingredients
    
    
    pool.query('update foodlist set categorynameid=?,customername=?,foodnameid=?,foodtype=?,ingredients=?,offerprice=?,price=? where foodlistid=?',
    [
        
        req.body.category_name,
        req.body.yourname,
        req.body.foodname,
        req.body.group1,
        ingredients,
        req.body.offerprice,
        req.body.price,
        foodlist
    ],
        function(error,result){

            if(error)
            {
                console.log(error);
                res.redirect('/food/displayall')
            }
            else
            {
                res.redirect('/food/displayall')
            }

        })

    }
    else
    {
        console.log(req.body);
    console.log(req.file);
    
    var foodlist   
        foodlist=req.body.foodlist
   

    var ingredients   
        ingredients=req.body.ingredients
    
    
    pool.query('delete from foodlist where foodlistid=?',
    [
        foodlist],
        function(error,result){

            if(error)
            {
                console.log(error);
                res.redirect('/food/displayall')
            }
            else
            {
                res.redirect('/food/displayall')
            }

        })
    }
})

router.get('/displaybyid',function(req,res){
    pool.query('select F.*,(select a.foodname from foods a where a.foodid=F.foodnameid) as fn,(select b.categoryname from foodtype b where b.categoryid=F.categorynameid) as cn from foodlist F where F.foodlistid=?',[req.query.foodlistid],function(error,result){

        if(error)
        {
            console.log(error);
            res.render('displaybyid',{data:[]})
        }
        else
        {
            console.log(result);
            res.render('displaybyid',{data:result[0]})
        }

    })
})

router.get('/displayall',function(req,res,next){
    var re=JSON.parse(localstorage.getItem('admin'))
    if(!re)
    {
        res.render('loginpage',{msg:''})
    }
   
    pool.query('select F.*,(select a.foodname from foods a where a.foodid=F.foodnameid) as fn,(select b.categoryname from foodtype b where b.categoryid=F.categorynameid) as cn from foodlist F',function(error,result){
       
        
       
        if(error)
        {
            console.log(error);
            res.render('display',{data:[]})
        }
        else
        {
            console.log(result);
            res.render('display',{data:result})
        }
    })
})

router.get('/addnewfood',function(req,res){
    res.render('addnewfood',{msg:''})
})


router.get('/fetchallcategory',function(req,res){
    pool.query('select * from foodtype',function(error,result){

        if(error)
        {
            res.status(500).json([])
        }
        else
        {
            res.status(200).json(result)
        }

    })
})




router.get('/fetchallfood',function(req,res){
    pool.query('select * from foods where categoryid=?',[req.query.categoryid],function(error,result){
        console.log(req.query.categoryname);
        if(error)
        {
            
            res.status(500).json([])
        }
        else
        {
            res.status(200).json(result)
        }

    })
})


router.post('/addrecord',upload.single('file'),function(req,res){
    
    console.log(req.body);
    console.log(req.file);
    
    var foodlist   
        foodlist=req.body.foodlist
   

    var ingredients   
        ingredients=req.body.ingredients
    
    
    pool.query('insert into foodlist(foodlistid,categorynameid,customername,foodnameid,foodtype,ingredients,price,offerprice,file) values(?,?,?,?,?,?,?,?,?)',
    [
        foodlist,
        req.body.category_name,
        req.body.yourname,
        req.body.foodname,
        req.body.group1,
        ingredients,
        req.body.price,
        req.body.offerprice,
        req.file.originalname],
        function(error,result){

            if(error)
            {
                console.log(error);
                res.render('addnewfood',{msg:'server error, record not submitted'})
            }
            else
            {
                res.render('addnewfood',{msg:'ok'})
            }

        })

  
})

module.exports=router;
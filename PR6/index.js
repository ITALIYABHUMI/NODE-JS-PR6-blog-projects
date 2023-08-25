const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser')
 
const port = 8300;

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(cookieParser()); 

const db = require('./config/mongoose');
const admintbl = require('./model/login');
const form = require('./model/form');
const { log } = require('console');

const file = multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,'uploads/')},
    filename:(req,file,cb)=>{
        cb(null,file.originalname)}
    })

    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const imagedata = multer({storage:file}).single('image');

app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    return res.render('register')
})

app.get('/login', (req, res) => {
    return res.render('login')
})

app.get('/table', async(req, res) => {
    try{
        let record = await form.find({});
        console.log(record);
        if(record){
            return res.render('table',{
                record
            }) 
        }
    }
    catch(err){
        console.log(err);
        return false;
    }
})

app.get('/chart', (req, res) => {
    return res.render('chart')
})

app.get('/form', (req, res) => {
    return res.render('form');
});   

app.post('/formdata',imagedata, async (req, res) => {
    let image= "";  
    if(req.file){
        image=req.file.path;
    }
    const { name, detail } = req.body;
    try {
        let data = await form.create({
            name: name,
            detail: detail,
            image:image
        }) 
        if (data) {
            console.log("data is added");
            return res.redirect('back');
        }
        else {
            console.log("data is not added");
            return false;
        }
    }
    catch (err) {
        console.log(err);
        return false;
    }
}) 


app.get('/index', (req, res) => {
    const data = req.cookies['login'];
    if(data){
        return res.render('index')
    }
    else{
        return res.redirect('/login')
    }
})


app.get('/signout',(req,res)=>{
    res.clearCookie('login');
    return res.redirect('/login')
})

 
app.post('/insertdata', async (req, res) => {
    const { name, email, password, c_password } = req.body;
    try {
        let data = await admintbl.create({
            name: name,
            email: email,
            password: password,
            c_password: c_password,
        })
        if (data) {
            console.log("data is added");
            return res.render('login');
        }
        else {
            console.log("data is not added");
            return false;
        }
    }
    catch (err) {
        console.log(err);
        return false;
    }
})
 

app.post('/viewdata', async (req, res) => {
    const { email, password } = req.body;
    try { 
        let detail = await admintbl.findOne({ email: email })
        if (!detail || detail.password != password) {
            console.log("password and  email is wrong");
            return res.redirect('back');
        }
        else {
            res.cookie('login', detail);
            return res.redirect('/index');
            }
    }
    catch (err) {
        console.log(err);
        return false;
    }
})

app.get('/editdata' ,async(req, res) => {
    try{
        id = req.query.id;
        let record = await form.findById(id)
        if(record){
            return res.render('edit', {
                record
            });
        } 
    }catch(err){
        console.log(err);
        return false;
    }
})

app.get('/deletedata' ,async(req, res) => {
    try{
        id = req.query.id;
        let record =await form.findByIdAndDelete(id);
        if(record){
            console.log("Record successfully deleted");
            fs.unlinkSync(record.image)
            return res.redirect('back');
        }
    }catch(err) {
        console.log(err);
    }
})

app.post('/updatedata',imagedata ,(req, res) => {
    id = req.body.editid;
    const{name, detail } = req.body;
    if(req.file){
        form.findById(id).then((oldimage) => {
            fs.unlinkSync(oldimage.image);
            let image = req.file.path;
            form.findByIdAndUpdate(id,{
                name: name,
                detail: detail,
                image:image,
            }).then((success) => {
                console.log("Record successfully deleted");
                return res.redirect('/table');
            }).catch((err) => {
                console.log(err);
                return false;
            })
        }).catch((err) => {
            console.log(err);
            return false;
        }) 
    }
    else{
        form.findById(id).then((oldimage) => {
            let image = oldimage.path;
            form.findByIdAndUpdate(id,{
                name: name,
                detail: detail,
                image:image
            }).then((success) => {
                console.log("Record successfully deleted");
                return res.redirect('/table');
            }).catch((err) => {
                console.log(err);
                return false;
            })
        }).catch((err) => {
            console.log(err);
            return false;
        }) 
    } 
})



app.listen(port, (err) => {
    if (err) {
        console.log("server  is not started");
        return false;
    }
    console.log("server is start : " + port);
})
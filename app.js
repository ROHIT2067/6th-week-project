const express=require('express')
const app=express()
const path=require('path')
const session=require('express-session')
const adminrouter=require('./routes/adminRoutes')
const nocache = require("nocache");
const userrouter=require('./routes/userRoutes')
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


const connectDB = require("./config/databaseConenct");
connectDB();

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(session({
  secret:"mySeceretKey",
  resave:false,
  saveUninitialized:false,
}))

app.use(nocache());

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'Views'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/',(req,res)=>res.redirect('/login'))
app.use('/admin',adminrouter)
app.use('/',userrouter)

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.use('/', (req, res) => {
  console.log(req.method)
  res.send("not found")
})

app.listen(3000,()=>console.log("http://localhost:3000/"))
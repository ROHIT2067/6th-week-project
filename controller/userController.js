const userCollection = require("../models/userModel.js");

const loginGet = (req, res) => {
    if (!req.session.adminUsr) {
        if (!req.session.user) {
            res.render("login", { loginerr1: req.session.loginerr1, loginerr: req.session.loginerr });
        } else {
            return res.redirect("/home");
        }
    } else {
        res.redirect("/admin/adminHome");
    }
};

const signupget = (req, res) => {
    if (!req.session.adminUsr) {
        if (!req.session.user) {
            return res.render("signup", { err: req.session.err, err1: req.session.err1, err2: req.session.err2 });
        } else {
            return res.redirect("/home");
        }
        
    }
};

// const homeget=(req,res)=>{
//   if(!req.session.adminUsr){
//     if(!req.session.user){
//       return res.redirect('/login')
//     }else{
//       return res.render('home',{name:req.session.user})
//     }
//   }
//   res.redirect('/admin/adminHome')
// }
const homeget = (req, res) => {
    if(!req.session.adminUsr) {
        if(!req.session.user) {
        return res.redirect('/login')
    }else{
        return res.render('home', {name: req.session.user})
    }
    }
    res.redirect('/admin/adminHome')
}



const signUppost = async (req, res) => {
    if (!req.session.adminUsr) {
        const data = {
            username: req.body.name,
            email: req.body.email,
            password: req.body.password,
        };
        if (data.username === "" || data.password === "" || data.email === "") {
            req.session.err = "Username is required";
            req.session.err1 = "Password is required";
            req.session.err2 = "Email  is required";
            return res.redirect("/signup");
        }

        if (data.username === "") {
            req.session.err = "Username is required";
            return res.redirect("/signup");
        } else if (!/^[a-zA-Z][a-zA-Z0-9_]{1,19}$/.test(data.username)) {
            req.session.err =
                "Username must start with a letter and be 2–20 characters long (letters, numbers, underscores)";
            return res.redirect("/signup");
        }

        if (data.password === "") {
            req.session.err1 = "Password is requied";
            return res.redirect("/signup");
        } else if (!/^[a-zA-Z0-9_]{6,20}$/.test(data.password)) {
            req.session.err1 = "Password should be 6–20 characters (letters, numbers, or _ only)";
            return res.redirect("/signup");
        } 

        if (data.email === "") {
            req.session.err2 = "Email is required";
            return res.redirect("/signup");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
            req.session.err2 = "Invalid email format. Please enter a valid email address.";
            return res.redirect("/signup");
        }

        let exist = await userCollection.findOne({ email: data.email });

        if (!exist) {
            req.session.user = data.username;
            await userCollection.create(data);
            return res.redirect("/home");
            
        } else {
            req.session.err2 = "User already exist";
            return res.redirect("/signup");
        }
    }
    res.redirect('/admin/adminHome')
};

const loginpost=async (req,res)=>{
  if(!req.session.adminUsr){
    try{
      const checkUsr=await userCollection.findOne({email:req.body.email})
      if(checkUsr.password.trim()===req.body.password.trim()){
        req.session.user=checkUsr.username
        return res.redirect('/home')
      }else{
        req.session.loginerr1="Incorrect Password"
        return res.redirect('/login')
      }
    }catch(error){
      req.session.loginerr="User not found"
      return res.redirect("/login")
    }
  }
  res.redirect('/admin/adminHome')
}

const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      // console.log(err);
      return res.redirect('/home'); 
    }
    res.clearCookie("connect.sid"); // remove session cookie
    res.set('Cache-Control', 'no-store'); // force browser not to reuse cache
    res.redirect('/login'); // redirect to login page
  });
};


module.exports = { loginGet, signupget, signUppost, loginpost, logout, homeget};

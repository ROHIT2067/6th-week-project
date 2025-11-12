const userCollection=require('../models/userModel.js')
let Admin='rohit'
let AdminPass='r'



const getLogin=async (req,res)=>{
  if(!req.session.user){
    if(!req.session.adminUsr){
      return res.render('adminlogin',{adminerr:req.session.erradmin})
    }
    return res.redirect('/admin/adminHome')
  }
  res.redirect('/home')
}

console.log("wfuwvbef")
const postLogin=(req,res)=>{
  try{
    if(Admin===req.body.adminUsr && AdminPass===req.body.adminPass){
      req.session.adminUsr=Admin
      res.redirect('/admin/adminHome')
    }else{
      if(AdminPass!=req.body.AdminPass){
        req.session.erradmin="Incorrect Password"
        res.redirect('/admin/login')
      }
    }
  }catch(error){

  }
}


// const getHome=async (req,res)=>{
//   res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
//   if(!req.session.adminUsr){
//     return res.redirect('/admin/login')
//   }
//   if(!req.session.searched){
//     let allDetails=await userCollection.find({})
//     return res.render('adminhome',{userdetails:allDetails})
//   }
//   let searchedUser=req.session.searched

//   req.session.searched=false
//   res.render('adminhome',{userdetails:searchedUser, addError:req.session.addError || null})
// }

const getHome = async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  if (!req.session.adminUsr) {
    return res.redirect('/admin/login');
  }

  if (!req.session.searched) {
    let allDetails = await userCollection.find({});
    res.render('adminhome', {
      userdetails: allDetails,
      addError: req.session.addError || null
    });
  } else {
    let searchedUser = req.session.searched;
    req.session.searched = false;
    res.render('adminhome', {
      userdetails: searchedUser,
      addError: req.session.addError || null
    });
  }

  // ✅ Clear addError after rendering, so it only shows once
  req.session.addError = null;
};



const adduser = async (req, res) => {
  try {
    const { addname, addemail, addpassword } = req.body;

    //Basic empty check
    if (!addname || !addemail || !addpassword) {
      req.session.addError = "All fields are required.";
      return res.redirect('/admin/adminHome');
    }

    //Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(addemail.trim())) {
      req.session.addError = "Invalid email format.";
      return res.redirect('/admin/adminHome');
    }

    //Check for existing user (unique email)
    const existUsr = await userCollection.findOne({ email: addemail.trim() });
    if (existUsr) {
      req.session.addError = "User with this email already exists.";
      return res.redirect('/admin/adminHome');
    }

    //Create new user
    await userCollection.create({
      username: addname.trim(),
      email: addemail.trim(),
      password: addpassword.trim(),
    });

    res.redirect('/admin/adminHome');

  } catch (error) {
    // console.error("Add user error:", error);
    res.redirect('/admin/adminHome');
  }
};



const deleteuser=async (req,res)=>{
  try{
    await userCollection.deleteOne({_id:req.params.id})
    res.redirect('/admin/adminHome')
  }catch(error){
    console.log(error)
  }
}


const searchuser=async (req,res)=>{
  try{
    let searchedUser=await userCollection.find({$or:[{username:{$regex:req.body.search}},{email:{$regex:req.body.search}}]})
    req.session.searched=searchedUser
    res.redirect('/admin/adminHome')
  }catch(error){
    console.log(error);
  }
}


const edituser= async (req,res)=>{
  if(req.session.adminUsr){
    try{
      let editUsr=await userCollection.findById({_id:req.params.editUserId})
      if(editUsr){
        return res.render('adminedit',{user:editUsr})
      }
      return res.redirect('/admin/adminHome')
    }catch(error){
      return res.send("Wrong ID!")
    
  }
  }
  return res.redirect('/')
}


// const updateuser= async (req,res)=>{
//   const checkUser= await userCollection.findById({_id:req.params.updatedUser})
//   const updatedUsr=await userCollection.updateOne({name:checkUser.name},{$set:{name:req.body.updateName,email:req.body.updateEmail}})
//   res.redirect('/admin/adminHome')
// }
const updateuser=async(req,res)=>{
  console.log(req.body)
  console.log(req.params.updatedUser)
  try{
    const updated= await userCollection.updateOne({_id:req.params.updatedUser},{$set:{username:req.body.updateName,email:req.body.updateEmail}},{new:true})
   console.log(updated)
  res.redirect('/admin/adminHome')
  }catch(error){
    console.log(error)
    res.redirect('/admin/adminHome')
  }
}


const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      // console.log("err");
      return res.redirect('/admin/adminHome');
    }
    res.clearCookie("connect.sid"); // remove session cookie
    res.set('Cache-Control', 'no-store'); // force browser not to reuse cache
    res.redirect('/admin/login'); // redirect to login page
  });
};



module.exports={getLogin,postLogin,getHome,logout,adduser,deleteuser,searchuser,edituser,updateuser}
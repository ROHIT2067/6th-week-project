const express=require('express')
const router=express.Router()
const session=require('express-session')
const userController=require('../controller/userController')



router.get('/login',userController.loginGet)

router.get('/signup',userController.signupget)

router.get('/home',userController.homeget)

router.post('/login',userController.loginpost)

router.post('/signup',userController.signUppost)

router.post('/logout',userController.logout)


module.exports=router
const express=require('express')
const router=express.Router()
const session=require('express-session')
const adminController=require('../controller/adminController')


router.get('/login',adminController.getLogin)
router.post('/login',adminController.postLogin)
router.get('/adminHome',adminController.getHome)
router.post('/adminLogout',adminController.logout)
router.post('/adminAdd',adminController.adduser)
router.delete('/adminDelete/:id',adminController.deleteuser)
router.post('/adminSearch',adminController.searchuser)
router.get('/adminEdit/:editUserId',adminController.edituser)
router.put('/updateUser/:updatedUser',adminController.updateuser)


module.exports=router
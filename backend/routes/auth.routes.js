const router=require('express').Router();
const {registerUser, loginUser} =require('../controller/user.controller')

router.post('/login', loginUser)
router.post('/signup', registerUser)

module.exports=router
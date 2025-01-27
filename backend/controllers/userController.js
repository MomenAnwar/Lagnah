const { genToken } = require("../middlewares/tokens")
const User = require("../models/User")
const bcrypt = require('bcrypt')
const { validateUpdateUser, validateSignUp } = require("../utils/joi")



const { transporter } = require('../utils/mailer')



const signUp = async (req, res) => {
    try {
        const { error } = validateSignUp(req.body)
        if(error){
            return res.status(400).json({success: false, data: error.details[0].message,})
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        const newUser = new User({...req.body, password: hashPassword})

        genToken(newUser._id, res)

        await newUser.save()
        res.status(201).json({success: true, data: 'أهلا بكم فى موقعنا، نتمنى لكم تجربة سعيدة!', body: {id: newUser._id,
            email: newUser.email, 
            isAdmin: false, 
            isManager: false, 
            messages: [], 
            name: newUser.name}})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}



const verifySignUpEmail = async (req, res) => {
    try {                
        const code = Math.floor(Math.random() * 10000)
        
        const user = await User.findOne({email: req.body.email})
        if(user){
            return res.status(400).json({success: false, data: 'هذا الحساب مسجل بالفعل!'})
        }
        const mailOptions = {
            name: 'لجنة الزكاة والصدقات ببهنيا',
            from: process.env.SENDER_MAIL,
            to: req.body.email,
            subject: 'تأكيد الحساب',
            text: `شكرا لتسجيلكم بموقع لجنة زكاة بهنيا، كود التأكيد هو: ${code}`,
        };
        

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, data: code });

    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}


const sendEmail = async (req, res) => {
    try {
        const mailOptions = {
            name: 'لجنة الزكاة والصدقات ببهنيا',
            from: process.env.SENDER_MAIL,
            to: req.body.email,
            subject: req.body.subject,
            text: red.body.message,
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.status(404).json({success: false, data: 'لم يتم العثور على هذا الحساب!'})
            }
        });

        res.status(200).json({success: true, data: code})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}


const sendMailToAll = async (req, res) => {
    try {

    const users = await User.find()

        const mailOptions = {
            name: 'لجنة الزكاة والصدقات ببهنيا',
            from: process.env.SENDER_MAIL,
            to: `${users.map(user => user.email + ', ')}`,
            subject: 'إلى الجميع',
            text: req.body.message
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.status(200).json({success: true, data: 'تم الإرسال.'})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}


const signIn = async (req, res) => {
    try {
        const { error } = validateUpdateUser(req.body)
        if(error){
            return res.status(400).json({success: false, data: error})
        }
        const { email, password} = req.body
        const userToLogIn = await User.findOne({email: email})
        const correctPassword = await bcrypt.compare(password, userToLogIn.password)
        if(!userToLogIn || !correctPassword){
            return res.status(400).json({success: false, data: 'كلمة المرور أو حساب المستخدم غير صحيح!'})
        }
        genToken(userToLogIn._id, res)
        res.status(200).json({success: true, data: 'تم تسجيل الدخول، أهلا بعودتك.', body: {id: userToLogIn._id,
                                                                                            email: userToLogIn.email, 
                                                                                            isAdmin: userToLogIn.isAdmin, 
                                                                                            isManager: userToLogIn.isManager, 
                                                                                            messages: userToLogIn.messages, 
                                                                                            name: userToLogIn.name}})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}


const setAsAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({success: false, data: 'هذا المستخدم غير موجود!'})
        }

        const admin = await User.findById(req.user)

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.adminPassword, salt)

        
        await User.findByIdAndUpdate(req.params.id, {
            $set: {
                isAdmin: true,
                adminPassword: hashPassword
            }
        }, {new: true})
        

        // const mailOptions = {
        //     from: admin.email,
        //     to: user.email,
        //     subject: 'تعيين كمسئول',
        //     text: `تم تعيينك كمسئول فى موقع لجنة الزكاة والصدقات ببهنيا، كلمة سر المسسئول الخاصة بك ${req.body.password}`
        // };
        // transporter.sendMail(mailOptions, function(error, info){
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log('Email sent: ' + info.response);
        //     }
        // });

        res.status(201).json({success: true, data: 'تم تعيين المستخدم كمسئول!'})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}


const toggleManager = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({success: false, data: 'هذا المستخدم غير موجود!'})
        }

        await User.findByIdAndUpdate(req.params.id, {
            $set: {
                isManager: !user.isManager,
            }
        }, {new: true})

        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: user.email,
            subject: 'تعيين كمسئول',
            text: `تم تعيينك كمسئول فى موقع لجنة الزكاة والصدقات ببهنيا `
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(201).json({success: true, data: 'تم تعيين المستخدم كمسئول!'})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}


const editUser = async (req, res) => {
    try {
        const { error } = validateSignUp(req.body)
        if(error){
            return res.status(400).json({success: false, data: error})
        }
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({success: false, data: 'هذا المستخدم غير موجود!'})
        }
        await User.findByIdAndUpdate(req.params.id, {
            $set: {
                isAdmin: false,
                isManager: false,
                ...req.body
            }
        }, { new: true })
        return res.status(201).json({success: true, data: 'تم تعيين المستخدم كمسئول!'})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -adminPassword').populate('messages')
        res.status(200).json({success: true, data: users})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}


const getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password  -adminPassword').populate('messages')
        if(!user){
            return res.status(404).json({success: false, data: 'هذا المستخدم غير موجود!'})
        }
        res.status(200).json({success: true, data: user})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}


const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({success: false, data: 'هذا المستخدم غير موجود!'})
        }
        await User.findByIdAndDelete(req.params.id)
        return res.status(200).json({success: true, data: 'تم حذف المستخدم!'})
    } catch (error) {
        res.status(400).json({success: false, data: error})
    }
}

module.exports = {
    deleteUser,
    getSingleUser,
    getAllUsers,
    editUser,
    setAsAdmin,
    signIn, 
    signUp,
    toggleManager,
    verifySignUpEmail,
    sendMailToAll,
    sendEmail
}
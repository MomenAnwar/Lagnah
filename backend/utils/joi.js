const Joi = require('joi')

const validateConsumer = (obj) => {
    const schema = Joi.object({
        name: Joi.string().required().trim(),
        partenerName: Joi.string().required().trim(),
        IDNumber: Joi.string().required().trim().length(14),
        phoneNumber: Joi.string().trim(),
        childrenCount: Joi.number().required().integer().positive(),
        income: Joi.number().positive(),
        age: Joi.number().positive().integer(),
    })
    return schema.validate(obj)
}


const validateTransaction = (obj) => {
    const schema = Joi.object({
        amount: Joi.number().positive().required(),
        type: Joi.string().required().trim(),
        depositeSource: Joi.string().trim(),
        isFinance: Joi.boolean().required(),
        targetDescription: Joi.string().trim(),
        consumers: Joi.array(),
        seedsType: Joi.string().trim(),
        images: Joi.array()
    })
    return schema.validate(obj)
}


const validateSignUp = (obj) => {
    const schema = Joi.object({
        name: Joi.string().required().trim(),
        email: Joi.string().required().trim(),
        password: Joi.string().required().trim()
    })
    return schema.validate(obj)
}


const validateUpdateUser = (obj) => {
    const schema = Joi.object({
        email: Joi.string().trim(),
        password: Joi.string().trim(),
    })
    return schema.validate(obj)
}


const validateMessage = (obj) => {
    const schema = Joi.object({
        content: Joi.string().trim().required()
    })
    return schema.validate(obj)
}



const validatePost= (obj) => {
    const schema = Joi.object({
        title: Joi.string().trim().required(),
        content: Joi.string().trim().required(),
        images: Joi.array()
    })
    return schema.validate(obj)
}



module.exports = {
    validateConsumer,
    validateTransaction,
    validateSignUp,
    validateUpdateUser,
    validateMessage,
    validatePost
}
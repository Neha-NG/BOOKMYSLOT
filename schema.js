const Joi = require('joi');

module.exports.slotSchema = Joi.object({
    slot : Joi.object({
        date: Joi.date().required(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
        // isBooked: Joi.boolean().required(),
        // bookedBy: Joi.string().allow("", null),
        // createdBy: Joi.string().required()
    }).required()
});
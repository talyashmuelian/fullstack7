const Joi = require("joi");

const schemaIdentification_customers = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const schemaCustomer_information = Joi.object().keys({
  name: Joi.string().required(),
  id_number: Joi.number().required(),
  phone: Joi.number().required(),
  email: Joi.string().required(),
});
const schemaCustomer = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  id_number: Joi.number().required(),
  phone: Joi.number().required(),
  email: Joi.string().required(),
});

const schemaPosts = Joi.object().keys({
  userId: Joi.number().required(),
  id: Joi.number().required(),
  title: Joi.string().required(),
  body: Joi.string().required(),
});

const schemaComments = Joi.object().keys({
  postId: Joi.number().required(),
  id: Joi.number().required(),
  name: Joi.string().required(),
  email: Joi.string().required(), //.email().
  body: Joi.string().required(),
});

const schemaPasswords = Joi.object().keys({
  id: Joi.number().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const ObjectCheck = {
  identification_customers: schemaIdentification_customers,
  customer_information: schemaCustomer_information,
  customer: schemaCustomer,
  posts: schemaPosts,
  comments: schemaComments,
  passwords: schemaPasswords,
};

exports.check = function (type, object) {
  const schema = ObjectCheck[type];
  console.log("in check");
  console.log(type);
  return schema.validate(object);
};

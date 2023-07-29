const Joi = require("joi");

const schemaIdentification_customers = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const schemaTodo = Joi.object().keys({
  userId: Joi.number().required(),
  id: Joi.number().required(),
  title: Joi.string().required(),
  completed: Joi.number().valid(0, 1).required(),
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
  todos: schemaTodo,
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

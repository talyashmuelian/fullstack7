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

const schemaRequest = Joi.object().keys({
  //sender_client_id, recipient_appointment_id, sender_appointment_id
  sender_client_id: Joi.number().required(),
  recipient_appointment_id: Joi.number().required(),
  sender_appointment_id: Joi.number().required(),
});

const schemaAppointment = Joi.object().keys({
  //customer_id, appointment_id, reminder, additionalInfo
  customer_id: Joi.number().required(),
  appointment_id: Joi.number().required(),
  reminder: Joi.number().required(),
  additionalInfo: Joi.string().required(),
});

const schemaPasswords = Joi.object().keys({
  id: Joi.number().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});
const newPayment = Joi.object().keys({
  customer_id: Joi.number().required(),
  amount_to_be_paid: Joi.number().required(),
});

const ObjectCheck = {
  identification_customers: schemaIdentification_customers,
  customer_information: schemaCustomer_information,
  customer: schemaCustomer,
  requests: schemaRequest,
  appointments: schemaAppointment,
  passwords: schemaPasswords,
  newPayment: newPayment,
};

exports.check = function (type, object) {
  const schema = ObjectCheck[type];
  console.log("in check");
  console.log(type);
  return schema.validate(object);
};

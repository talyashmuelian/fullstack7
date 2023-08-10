const hostname = "http://localhost:4000";
path = "/signInCustomers";

async function requestsPost(path, object) {
  let requestBody;
  if (typeof object === "string") {
    requestBody = object;
  } else {
    requestBody = JSON.stringify(object);
  }

  console.log(requestBody);

  const response = await fetch(hostname + path, {
    method: "POST",
    body: requestBody,
    headers: {
      "Content-type": "application/json",
    },
  });

  return await response.json();
}
let cus = {
  username: "talya",
  password: 1,
};
requestsPost(path, cus);

const hostname = "http://localhost:3001";

export async function requestsGet(path) {
  console.log(hostname + path);
  const response = await fetch(hostname + path);
  return response;
}

export async function requestsPost(path, object) {
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

  return response;
}

export async function requestsPut(path, object) {
  console.log("in put");
  console.log(object);
  const response = await fetch(hostname + path, {
    method: "PUT",
    body: JSON.stringify(object),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  return response;
}

export async function requestsDelete(path) {
  const response = await fetch(hostname + path, {
    method: "DELETE",
  });
  return response;
}

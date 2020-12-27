async function getSignatures(apiUrl) {
  if (!apiUrl) {
    throw "Please provide an API URL";
  }
  const response = await fetch(apiUrl);
  return response.json();
}

function postFormData(url, formData, progress) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const sendError = (e, label) => {
      console.error(e);
      reject(label);
    };
    request.open("POST", url);
    request.upload.addEventListener("error", (e) =>
      sendError(e, "upload error")
    );
    request.upload.addEventListener("timeout", (e) =>
      sendError(e, "upload timeout")
    );
    request.upload.addEventListener("progress", progress);
    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 400) {
        resolve();
      } else {
        reject(request.responseText);
      }
    });
    request.addEventListener("error", (e) => sendError(e, "server error"));
    request.addEventListener("abort", (e) =>
      sendError(e, "server aborted request")
    );
    request.send(formData);
  });
}

function parseXML(xmlString, textQueryElement) {
  const parser = new DOMParser(),
    doc = parser.parseFromString(xmlString, "application/xml"),
    element = textQueryElement && doc.querySelector(textQueryElement);
  if (!textQueryElement) {
    return doc;
  }
  return element && element.textContent;
}

function uploadBlob(uploadPolicy, fileBlob, progress) {
  const formData = new window.FormData();
  Object.keys(uploadPolicy.fields).forEach((key) =>
    formData.append(key, uploadPolicy.fields[key])
  );
  formData.append("file", fileBlob);
  return postFormData(uploadPolicy.url, formData, progress).catch((e) => {
    if (parseXML(e, "Code") === "EntityTooLarge") {
      throw `File ${fileBlob.name} is too big to upload.`;
    }
    throw "server error";
  });
}

function promiseTimeout(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
async function pollForResult(url, timeout, times) {
  if (times <= 0) {
    throw "no retries left";
  }
  await promiseTimeout(timeout);
  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        Range: "bytes=0-10",
      },
    });
    if (!response.ok) {
      console.log("file not ready, retrying");
      return pollForResult(url, timeout, times - 1);
    }
    return "OK";
  } catch (e) {
    console.error("network error");
    console.error(e);
    return pollForResult(url, timeout, times - 1);
  }
}

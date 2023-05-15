const API_KEY = "";
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

// Also try DOCUMENT_TEXT_DETECTION instead of TEXT_DETECTION as per https://cloud.google.com/vision/docs/ocr
function generateBody(image) {
  const body = {
    requests: [
      {
        image: {
          content: image,
        },
        features: [
          {
            type: "TEXT_DETECTION", // Refer the docs for the paramas
            maxResults: 1,
          },
        ],
      },
    ],
  };
  return body;
}

async function callGoogleVisionAsync(image) {
  return new Promise(async (resolve, reject) => {
    const body = generateBody(image); //pass in our image for the payload
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    response
      .json()
      .then((res) => {
        console.log(res.responses[0].fullTextAnnotation.text);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default callGoogleVisionAsync;

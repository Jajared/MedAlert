require("dotenv").config();

import { MedicationItemData } from "../../utils/types";

const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.VISION_API_KEY}`;

// Also try DOCUMENT_TEXT_DETECTION instead of TEXT_DETECTION as per https://cloud.google.com/vision/docs/ocr
function generateBody(image: string) {
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

async function callGoogleVisionAsync(image: string, setIsLoading: (isLoading: boolean) => void, setState: (state: MedicationItemData) => void, state: MedicationItemData) {
  return new Promise(async (resolve, reject) => {
    setIsLoading(true);
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
        const response = res.responses[0].fullTextAnnotation.text;
        const result = parseText(response);
        setState({ ...state, Name: result[0], Instructions: { ...state.Instructions, TabletsPerIntake: result[1] } });
        resolve(res);
        setIsLoading(false);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Parse the text to extract the medication name and dosage per intake
function parseText(text: string) {
  text = text.replace(/\n/g, " ");
  // Extract medication name
  const medicationNameRegex = /([a-zA-Z]+\s)?\d+MG/i;
  const medicationNameMatch = text.match(medicationNameRegex);
  const medicationName = medicationNameMatch ? medicationNameMatch[1] : "";
  const cleanedMedicationName = medicationName.charAt(0).toUpperCase() + medicationName.slice(1).toLowerCase();

  // Extract dosage per intake
  const dosageIntakeRegex = /take (\d+|[A-Z]+) tab/i;
  const dosageIntakeMatch = text.match(dosageIntakeRegex);
  const dosageIntake = dosageIntakeMatch ? dosageIntakeMatch[1] : "";
  const numberMapping = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  };
  const isNumber = (value) => !isNaN(value);
  const cleanedDosageIntake = isNumber(dosageIntake) ? Number(dosageIntake) : numberMapping[dosageIntake.toLowerCase()];
  if (cleanedDosageIntake == 0 || cleanedDosageIntake == "") {
    alert("Unable to detect medication details. Please try again.");
  }
  return [cleanedMedicationName, cleanedDosageIntake];
}

export default callGoogleVisionAsync;

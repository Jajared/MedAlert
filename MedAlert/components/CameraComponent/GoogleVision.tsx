const API_KEY = "AIzaSyA630mEkGs-Zq9cMkIVWs9rfrLEZGOIKic";
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

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

async function callGoogleVisionAsync(image: string, setIsLoading: (isLoading: boolean) => void) {
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
        detectMedicationNames(response);
        resolve(res);
        setIsLoading(false);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function detectMedicationNames(text: string): string[] {
  const medicationDictionary: string[] = [
    // Add medication names to the dictionary
    "Etoricoxib",
    // Add more medication names as needed
  ];

  const detectedMedicationNames: string[] = [];

  // Step 1: Tokenization
  const tokens: string[] = text.split(/\s+/);

  // Step 2: Text Processing
  const processedTokens: string[] = tokens.map((token) => token.toLowerCase());

  // Step 3: Keyword Matching
  for (const token of processedTokens) {
    // Step 3a: Exact Match
    if (medicationDictionary.includes(token)) {
      detectedMedicationNames.push(token);
    }
    // Step 3b: Partial Match
    else {
      const partialMatches: string[] = medicationDictionary.filter((medication) => medication.includes(token));
      detectedMedicationNames.push(...partialMatches);
    }
  }

  // Step 4: Context Analysis
  const contextKeywords: string[] = ["medicine", "drug", "prescription", "mg", "tab"];
  const filteredMedicationNames: string[] = detectedMedicationNames.filter((name) => contextKeywords.some((keyword) => text.toLowerCase().includes(keyword)));

  // Step 5: Validation
  const validatedMedicationNames: string[] = validateMedicationNames(filteredMedicationNames);

  // Step 6: Post-processing
  const uniqueMedicationNames: string[] = Array.from(new Set(validatedMedicationNames));

  return uniqueMedicationNames;
}

// Helper function for validation using external sources
function validateMedicationNames(medicationNames: string[]): string[] {
  // Perform validation using external sources or APIs
  // Example: Make API requests to DrugBank API or RxNorm API for validation
  // Return the validated medication names
  return medicationNames;
}

export default callGoogleVisionAsync;

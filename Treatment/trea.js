const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/medicine-jDbfXee1Lmw8Jt9o5MVnzSpfAplp2E.csv";
let medicineData = [];

// Fetch and parse CSV data
Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: function (results) {
    medicineData = results.data;
    console.log("CSV data loaded:", medicineData);
  },
});

document.getElementById("submit").addEventListener("click", function () {
  const condition = document
    .getElementById("condition")
    .value.trim()
    .toLowerCase();
  const symptomsInput = document
    .getElementById("symptoms")
    .value.trim()
    .toLowerCase();

  const symptoms = symptomsInput
    ? symptomsInput.split(",").map((s) => s.trim())
    : null;

  const matchedCondition = medicineData.find(
    (item) => item.Condition.toLowerCase() === condition
  );

  if (matchedCondition) {
    if (!symptoms) {
      // If symptoms are not provided, return the treatment based on condition only
      displayResult(matchedCondition);
    } else {
      const matchedSymptoms = matchedCondition.Symptoms.toLowerCase()
        .split(",")
        .map((s) => s.trim());
      const symptomMatch = symptoms.some((s) => matchedSymptoms.includes(s));

      if (symptomMatch) {
        displayResult(matchedCondition);
      } else {
        displayNoMatch();
      }
    }
  } else {
    displayNoMatch();
  }
});

function displayResult(data) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
        <h3>Personalized Treatment Plan</h3>
        <p><strong>Condition:</strong> ${data.Condition}</p>
        <p><strong>Symptoms:</strong> ${data.Symptoms}</p>
        <p><strong>Recommended Treatment:</strong> ${data["Recommended Treatment"]}</p>
        <p><strong>Treatment Description:</strong> ${data["Treatment Description"]}</p>
        <p><strong>Lifestyle Changes:</strong></p>
        <ul>
            <li>Maintain a balanced diet rich in fruits, vegetables, and whole grains</li>
            <li>Exercise regularly, aiming for at least 30 minutes of moderate activity most days</li>
            <li>Get adequate sleep, typically 7-9 hours per night</li>
            <li>Manage stress through relaxation techniques like meditation or yoga</li>
            <li>Avoid smoking and limit alcohol consumption</li>
        </ul>
    `;
}

function displayNoMatch() {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
        <h3>No Matching Treatment Found</h3>
        <p>We couldn't find a specific treatment plan for the condition and symptoms you entered. Please consult with a healthcare professional for personalized advice.</p>
    `;
}

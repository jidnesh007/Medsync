document.getElementById("patientForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Collect form data
  const formData = new FormData(this);
  const patientData = Object.fromEntries(formData.entries());

  // Simulate ML-based recommendations
  const recommendations = generateRecommendations(patientData);

  // Display recommendations
  document.getElementById("treatmentPlan").textContent =
    recommendations.treatmentPlan;
  document.getElementById("lifestyleChanges").textContent =
    recommendations.lifestyleChanges;
  document.getElementById("recommendations").classList.remove("hidden");
});

function generateRecommendations(patientData) {
  // This is a simplified simulation of ML-based recommendations
  // In a real-world scenario, this would involve complex algorithms and medical expertise

  let treatmentPlan = "Based on your data, we recommend: ";
  let lifestyleChanges = "We suggest the following lifestyle changes: ";

  // Exercise recommendations
  if (patientData.exercise < 3) {
    lifestyleChanges += "Increase your weekly exercise to at least 3 hours. ";
  }

  // Sleep recommendations
  if (patientData.sleep < 7) {
    lifestyleChanges += "Try to get at least 7 hours of sleep per night. ";
  }

  // Diet recommendations
  if (patientData.diet === "omnivore") {
    lifestyleChanges +=
      "Consider incorporating more plant-based meals into your diet. ";
  }

  // Symptom-based recommendations
  const symptoms = patientData.symptoms
    .toLowerCase()
    .split(",")
    .map((s) => s.trim());
  if (symptoms.includes("headache")) {
    treatmentPlan += "Regular check-ups to monitor blood pressure. ";
  }
  if (symptoms.includes("fatigue")) {
    treatmentPlan += "Blood tests to check for potential deficiencies. ";
  }

  // Existing conditions-based recommendations
  const conditions = patientData.conditions
    .toLowerCase()
    .split(",")
    .map((s) => s.trim());
  if (conditions.includes("diabetes")) {
    treatmentPlan += "Regular blood sugar monitoring. ";
    lifestyleChanges += "Follow a diabetes-friendly diet. ";
  }

  return {
    treatmentPlan: treatmentPlan,
    lifestyleChanges: lifestyleChanges,
  };
}

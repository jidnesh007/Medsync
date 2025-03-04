document.addEventListener("DOMContentLoaded", () => {
  const addMedicationBtn = document.getElementById("addMedication");
  const medicationList = document.querySelector(".medication-list");
  const medicationNameInput = document.getElementById("medicationName");
  const medicationTimeInput = document.getElementById("medicationTime");
  const progressGraph = document.getElementById("progressGraph");

  let medications = JSON.parse(localStorage.getItem("medications")) || [];
  let chart;

  // Request Notification Permission
  if (Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission !== "granted") {
        alert("Please enable notifications to receive reminders!");
      }
    });
  }

  function saveMedications() {
    localStorage.setItem("medications", JSON.stringify(medications));
  }

  function renderMedications() {
    medicationList.innerHTML = "";
    medications.forEach((med, index) => {
      const medicationItem = document.createElement("div");
      medicationItem.classList.add("medication-item");
      medicationItem.innerHTML = `
                <div class="medication-info">
                    <span class="medication-name">${med.name}</span>
                    <span class="medication-time">${med.time}</span>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${
                          med.progress[med.progress.length - 1]
                        }%"></div>
                    </div>
                </div>
                <div class="medication-actions">
                    <button class="take-btn" title="Take medication"><i class="fas fa-check"></i></button>
                    <button class="delete-btn" title="Delete medication"><i class="fas fa-trash"></i></button>
                </div>
            `;

      const takeBtn = medicationItem.querySelector(".take-btn");
      const deleteBtn = medicationItem.querySelector(".delete-btn");

      takeBtn.addEventListener("click", () => takeMedication(index));
      deleteBtn.addEventListener("click", () => deleteMedication(index));

      medicationList.appendChild(medicationItem);
    });
    updateGraph();
  }

  function addMedication() {
    const name = medicationNameInput.value.trim();
    const time = medicationTimeInput.value;

    if (name && time) {
      medications.push({ name, time, progress: [0] });
      saveMedications();
      renderMedications();
      medicationNameInput.value = "";
      medicationTimeInput.value = "";
    }
  }

  function takeMedication(index) {
    const lastProgress =
      medications[index].progress[medications[index].progress.length - 1];
    const newProgress = Math.min(100, lastProgress + 25);
    medications[index].progress.push(newProgress);
    saveMedications();
    renderMedications();
  }

  function deleteMedication(index) {
    medications.splice(index, 1);
    saveMedications();
    renderMedications();
  }

  function updateGraph() {
    const ctx = progressGraph.getContext("2d");

    if (chart) {
      chart.destroy();
    }

    const datasets = medications.map((med, index) => ({
      label: med.name,
      data: med.progress,
      borderColor: getColor(index),
      fill: false,
    }));

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from(
          { length: Math.max(...medications.map((m) => m.progress.length)) },
          (_, i) => `Day ${i + 1}`
        ),
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: "Progress (%)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Days",
            },
          },
        },
      },
    });
  }

  function getColor(index) {
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
    ];
    return colors[index % colors.length];
  }

  // Check medication times every minute
  function checkMedicationTimes() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Current time in HH:mm format

    medications.forEach((med) => {
      if (med.time === currentTime) {
        showNotification(med.name);
      }
    });
  }

  function showNotification(medicationName) {
    if (Notification.permission === "granted") {
      new Notification("Medication Reminder", {
        body: `It's time to take your medication: ${medicationName}`,
        icon: "https://cdn-icons-png.flaticon.com/512/2913/2913962.png", // Replace with an icon URL
      });
    }
  }

  addMedicationBtn.addEventListener("click", addMedication);

  setInterval(checkMedicationTimes, 60000); // Check every minute

  renderMedications();
});

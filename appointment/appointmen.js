document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appointmentForm");
  const doctorSelect = document.getElementById("doctor");
  const dateInput = document.getElementById("date");
  const timeSelect = document.getElementById("time");

  // Sample available time slots for each doctor
  const doctorTimeSlots = {
    "dr-smith": ["09:00", "10:00", "11:00", "14:00", "15:00"],
    "dr-johnson": ["09:30", "10:30", "11:30", "14:30", "15:30"],
    "dr-williams": ["10:00", "11:00", "13:00", "14:00", "16:00"],
  };

  // Update available time slots based on selected doctor and date
  function updateTimeSlots() {
    const selectedDoctor = doctorSelect.value;
    const selectedDate = dateInput.value;

    // Clear existing options
    timeSelect.innerHTML = '<option value="">Select a time</option>';

    if (selectedDoctor && selectedDate) {
      const availableSlots = doctorTimeSlots[selectedDoctor];
      availableSlots.forEach((slot) => {
        const option = document.createElement("option");
        option.value = slot;
        option.textContent = slot;
        timeSelect.appendChild(option);
      });
    }
  }

  doctorSelect.addEventListener("change", updateTimeSlots);
  dateInput.addEventListener("change", updateTimeSlots);

  // Form validation
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically send the form data to a server
      alert("Appointment booked successfully!");
      form.reset();
    }
  });

  function validateForm() {
    let isValid = true;
    const inputs = form.querySelectorAll("input, select, textarea");

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        showError(input, "This field is required");
      } else {
        clearError(input);
      }
    });

    // Additional email validation
    const emailInput = document.getElementById("email");
    if (emailInput.value && !isValidEmail(emailInput.value)) {
      isValid = false;
      showError(emailInput, "Please enter a valid email address");
    }

    return isValid;
  }

  function showError(input, message) {
    input.classList.add("error");
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    input.parentNode.appendChild(errorElement);
  }

  function clearError(input) {
    input.classList.remove("error");
    const errorElement = input.parentNode.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});

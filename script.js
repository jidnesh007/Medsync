document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right,.animate-on-scroll-del"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 } // Trigger when 20% of the element is visible
  );

  animatedElements.forEach((element) => observer.observe(element));

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Graph Animation Initialization
  const canvas = document.getElementById("graphCanvas");
  const ctx = canvas.getContext("2d");
  const data = [
    { week: 1, value: 65 },
    { week: 2, value: 70 },
    { week: 3, value: 75 },
    { week: 4, value: 80 },
  ];

  let animationProgress = 0;

  function setCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }

  function drawGraph(progress) {
    setCanvasSize();
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    const padding = 40;

    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#e5e5e5";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const x = padding + (i * (width - 2 * padding)) / 4;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    for (let i = 0; i <= 10; i++) {
      const y = padding + (i * (height - 2 * padding)) / 10;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw the line graph
    ctx.beginPath();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;

    data.forEach((point, i) => {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y =
        height - (padding + ((point.value - 0) * (height - 2 * padding)) / 100);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const prevX =
          padding + ((i - 1) * (width - 2 * padding)) / (data.length - 1);
        const prevY =
          height -
          (padding + ((data[i - 1].value - 0) * (height - 2 * padding)) / 100);

        const interpolatedX = prevX + (x - prevX) * progress;
        const interpolatedY = prevY + (y - prevY) * progress;

        ctx.lineTo(interpolatedX, interpolatedY);
      }
    });
    ctx.stroke();

    // Draw points
    data.forEach((point, i) => {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y =
        height - (padding + ((point.value - 0) * (height - 2 * padding)) / 100);

      if (progress >= i / (data.length - 1)) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.strokeStyle = "#3b82f6";
        ctx.stroke();
      }
    });
  }

  function animateGraph() {
    animationProgress += 0.01;
    if (animationProgress > 1) animationProgress = 1;

    drawGraph(animationProgress);

    if (animationProgress < 1) {
      requestAnimationFrame(animateGraph);
    }
  }

  // Intersection Observer to trigger graph animation
  const graphObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateGraph();
          graphObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  graphObserver.observe(canvas);

  // Redraw graph on window resize
  window.addEventListener("resize", () => drawGraph(animationProgress));
});

function toggleChat() {
  document.getElementById("chatDropdown").classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches(".chat-dropdown button")) {
    var dropdowns = document.getElementsByClassName("chat-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

function subscribeNewsletter() {
  var email = document.getElementById("email").value;
  if (email) {
    alert("Thank you for subscribing with: " + email);
    document.getElementById("email").value = "";
  } else {
    alert("Please enter a valid email address.");
  }
}

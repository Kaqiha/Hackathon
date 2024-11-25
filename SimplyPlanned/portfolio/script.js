const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const savedRatings = JSON.parse(localStorage.getItem("dailyRatings")) || {};

const planner = document.getElementById("planner");
days.forEach(day => {
  const dayEntry = document.createElement("div");
  dayEntry.className = "day-entry";

  const dayLabel = document.createElement("div");
  dayLabel.className = "day-label";
  dayLabel.textContent = day;

  const ratingDiv = document.createElement("div");
  ratingDiv.className = "rating";

  for (let i = 1; i <= 5; i++) {
    const button = document.createElement("button");
    button.textContent = i;

    if (savedRatings[day] === i) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      savedRatings[day] = i;
      localStorage.setItem("dailyRatings", JSON.stringify(savedRatings));

      ratingDiv.querySelectorAll("button").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
    });

    ratingDiv.appendChild(button);
  }

  dayEntry.appendChild(dayLabel);
  dayEntry.appendChild(ratingDiv);
  planner.appendChild(dayEntry);
});
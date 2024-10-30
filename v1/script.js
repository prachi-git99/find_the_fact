const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

//   selecting dom elements
const btn = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form");
const factsList = document.querySelector(".facts-list");

//create dom element : render facts in list
factsList.innerHTML = "";

// load data from supabase

loadFacts();

async function loadFacts() {
  const res = await fetch(
    "https://daphbptdeaaitcwnnely.supabase.co/rest/v1/fact",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcGhicHRkZWFhaXRjd25uZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyMTYwNjMsImV4cCI6MjA0NTc5MjA2M30.vVIjJcAtfSnXNa1aYV1S6K7AyjpKoxIwrRyIdspBMZs",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhcGhicHRkZWFhaXRjd25uZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyMTYwNjMsImV4cCI6MjA0NTc5MjA2M30.vVIjJcAtfSnXNa1aYV1S6K7AyjpKoxIwrRyIdspBMZs",
      },
    }
  );

  const data = await res.json();
  createFactsList(data);
}

// createFactsList(initialFacts);

function createFactsList(dataArray) {
  const htmlArr = dataArray.map(
    (fact) => `<li class="fact"><p>
                      ${fact.text}
                      <a class="source" href="${fact.source}">(Source)</a>
                    </p>
                    <span class="tag" style="background-color: ${
                      CATEGORIES.find((cat) => cat.name === fact.category).color
                    }"
                      >${fact.category}</span
                    >
                    <div class="vote-buttons">
                      <button>👍 ${fact.votesInteresting}</button>
                      <button>🤯 ${fact.votesMindblowing}</button>
                      <button>⛔️ ${fact.votesFalse}</button>
                    </div></li>`
  );
  const html = htmlArr.join("");
  factsList.insertAdjacentHTML("afterbegin", html);
}

//toggel form visibility
btn.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btn.textContent = "Share a fact";
  }
});

//FILTERS FOR COLORS AND CATEGORY
console.log(CATEGORIES.find((cat) => cat.name === "society").color);

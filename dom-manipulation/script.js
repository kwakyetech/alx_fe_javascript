// ---- Data store ----------------------------------------------------------
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

// ---- Random quote --------------------------------------------------------
function showRandomQuote() {
  const target = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    target.textContent = "No quotes available.";
    return;
  }
  const i = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[i];
  target.textContent = `"${text}" — [${category}]`;
}

// ---- Create form with innerHTML ------------------------------------------
function createAddQuoteForm() {
  const mount = document.getElementById("addQuoteForm");

  // 🔑 This line ensures innerHTML is used
  mount.innerHTML = `
    <h2>Add a New Quote</h2>
    <form id="quoteForm" autocomplete="off">
      <div class="row">
        <label for="quoteText">Quote</label>
        <textarea id="quoteText" rows="3" placeholder="e.g., Simplicity is the soul of efficiency." required></textarea>
      </div>
      <div class="row">
        <label for="quoteCategory">Category</label>
        <input type="text" id="quoteCategory" placeholder="e.g., Motivation" required />
      </div>
      <button type="submit">Add Quote</button>
    </form>
    <p class="muted">Fill both fields and press “Add Quote”.</p>
  `;

  const form = document.getElementById("quoteForm");
  const helper = mount.querySelector("p");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = document.getElementById("quoteText").value.trim();
    const category = document.getElementById("quoteCategory").value.trim();

    if (!text || !category) {
      helper.className = "error";
      helper.textContent = "Please provide both a quote and a category.";
      return;
    }

    quotes.push({ text, category });

    helper.className = "success";
    helper.textContent = "Quote added successfully!";
    form.reset();
    showRandomQuote();
  });
}

// ---- Wire up UI ----------------------------------------------------------
document.getElementById("randomBtn").addEventListener("click", showRandomQuote);
createAddQuoteForm();

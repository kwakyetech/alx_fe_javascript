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
    target.innerHTML = "No quotes available."; // ✅ using innerHTML
    return;
  }
  const i = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[i];
  target.innerHTML = `"${text}" — [${category}]`;
}

// ---- Create form --------------------------------------------------------
function createAddQuoteForm() {
  const mount = document.getElementById("addQuoteForm");

  // Title
  const title = document.createElement("h2");
  title.textContent = "Add a New Quote";
  mount.appendChild(title);

  // Form
  const form = document.createElement("form");
  form.setAttribute("id", "quoteForm");
  form.setAttribute("autocomplete", "off");
  mount.appendChild(form);

  // Quote row
  const quoteRow = document.createElement("div");
  quoteRow.className = "row";
  form.appendChild(quoteRow);

  const quoteLabel = document.createElement("label");
  quoteLabel.setAttribute("for", "quoteText");
  quoteLabel.textContent = "Quote";
  quoteRow.appendChild(quoteLabel);

  const quoteInput = document.createElement("textarea");
  quoteInput.setAttribute("id", "quoteText");
  quoteInput.setAttribute("rows", "3");
  quoteInput.required = true;
  quoteRow.appendChild(quoteInput);

  // Category row
  const catRow = document.createElement("div");
  catRow.className = "row";
  form.appendChild(catRow);

  const catLabel = document.createElement("label");
  catLabel.setAttribute("for", "quoteCategory");
  catLabel.textContent = "Category";
  catRow.appendChild(catLabel);

  const catInput = document.createElement("input");
  catInput.setAttribute("type", "text");
  catInput.setAttribute("id", "quoteCategory");
  catInput.required = true;
  catRow.appendChild(catInput);

  // Submit button
  const submitBtn = document.createElement("button");
  submitBtn.setAttribute("type", "submit");
  submitBtn.textContent = "Add Quote";
  form.appendChild(submitBtn);

  // Helper message (innerHTML here)
  const helper = document.createElement("p");
  helper.className = "muted";
  helper.innerHTML = "Fill both fields and press “Add Quote”.";
  mount.appendChild(helper);

  // Form submit handler
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = quoteInput.value.trim();
    const category = catInput.value.trim();

    if (!text || !category) {
      helper.className = "error";
      helper.innerHTML = "Please provide both a quote and a category.";
      return;
    }

    // ✅ create newQuote object
    const newQuote = { text, category };

    // ✅ push newQuote into quotes
    quotes.push(newQuote);

    helper.className = "success";
    helper.innerHTML = "Quote added successfully!";
    form.reset();
    showRandomQuote();
  });
}

// ---- Wire up UI ----------------------------------------------------------
document.getElementById("randomBtn").addEventListener("click", showRandomQuote);
createAddQuoteForm();

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

// ---- Step-by-step form creation with appendChild ------------------------
function createAddQuoteForm() {
    const mount = document.getElementById("addQuoteForm");

    // Title
    const title = document.createElement("h2");
    title.appendChild(document.createTextNode("Add a New Quote"));
    mount.appendChild(title);

    // Form element
    const form = document.createElement("form");
    form.setAttribute("id", "quoteForm");
    form.setAttribute("autocomplete", "off");
    mount.appendChild(form);

    // --- Quote field (label + textarea)
    const quoteRow = document.createElement("div");
    quoteRow.className = "row";
    form.appendChild(quoteRow);

    const quoteLabel = document.createElement("label");
    quoteLabel.setAttribute("for", "quoteText");
    quoteLabel.appendChild(document.createTextNode("Quote"));
    quoteRow.appendChild(quoteLabel);

    const quoteInput = document.createElement("textarea");
    quoteInput.setAttribute("id", "quoteText");
    quoteInput.setAttribute("rows", "3");
    quoteInput.setAttribute("placeholder", "e.g., Simplicity is the soul of efficiency.");
    quoteInput.required = true;
    quoteRow.appendChild(quoteInput);

    // --- Category field (label + input)
    const catRow = document.createElement("div");
    catRow.className = "row";
    form.appendChild(catRow);

    const catLabel = document.createElement("label");
    catLabel.setAttribute("for", "quoteCategory");
    catLabel.appendChild(document.createTextNode("Category"));
    catRow.appendChild(catLabel);

    const catInput = document.createElement("input");
    catInput.setAttribute("type", "text");
    catInput.setAttribute("id", "quoteCategory");
    catInput.setAttribute("placeholder", "e.g., Motivation");
    catInput.required = true;
    catRow.appendChild(catInput);

    // --- Submit button
    const submitBtn = document.createElement("button");
    submitBtn.setAttribute("type", "submit");
    submitBtn.appendChild(document.createTextNode("Add Quote"));
    form.appendChild(submitBtn);

    // --- Helper/feedback message
    const helper = document.createElement("p");
    helper.className = "muted";
    helper.appendChild(document.createTextNode("Fill both fields and press “Add Quote”."));
    mount.appendChild(helper);

    // --- Submit handler
    form.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = quoteInput.value.trim();
    const category = catInput.value.trim();

    // Basic validation feedback
    if (!text || !category) {
        helper.className = "error";
        helper.textContent = "Please provide both a quote and a category.";
        return;
    }

    // Add to array
    quotes.push({ text, category });

    // UI feedback
    helper.className = "success";
    helper.textContent = "Quote added successfully!";
    form.reset();

    // Optionally show a fresh random quote
    showRandomQuote();
    });
}

// ---- Wire up UI ----------------------------------------------------------
document.getElementById("randomBtn").addEventListener("click", showRandomQuote);
createAddQuoteForm();
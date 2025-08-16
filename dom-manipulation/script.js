 // ---- Data store ----------------------------------------------------------
    let quotes = [];

    // ---- Helpers: LocalStorage ----------------------------------------------
    function saveQuotes() {
      localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    function loadQuotes() {
      const stored = localStorage.getItem("quotes");
      if (stored) {
        quotes = JSON.parse(stored);
      } else {
        // default quotes
        quotes = [
          { text: "The best way to predict the future is to invent it.", category: "Motivation" },
          { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
          { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
        ];
        saveQuotes();
      }
    }

    // ---- Random quote --------------------------------------------------------
    function showRandomQuote() {
      const target = document.getElementById("quoteDisplay");
      if (quotes.length === 0) {
        target.innerHTML = "No quotes available.";
        return;
      }
      const i = Math.floor(Math.random() * quotes.length);
      const { text, category } = quotes[i];
      target.innerHTML = `"${text}" — [${category}]`;

      // save last viewed quote in sessionStorage
      sessionStorage.setItem("lastQuote", JSON.stringify({ text, category }));
    }

    // ---- Create form ---------------------------------------------------------
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

      // Helper message
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

        const newQuote = { text, category };
        quotes.push(newQuote);
        saveQuotes();

        helper.className = "success";
        helper.innerHTML = "Quote added successfully!";
        form.reset();
        showRandomQuote();
      });
    }

    // ---- Export JSON ---------------------------------------------------------
    function exportToJsonFile() {
      const dataStr = JSON.stringify(quotes, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "quotes.json";
      link.click();

      URL.revokeObjectURL(url);
    }

    // ---- Import JSON ---------------------------------------------------------
    function importFromJsonFile(event) {
      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        try {
          const importedQuotes = JSON.parse(e.target.result);
          if (Array.isArray(importedQuotes)) {
            quotes.push(...importedQuotes);
            saveQuotes();
            alert("Quotes imported successfully!");
          } else {
            alert("Invalid JSON format.");
          }
        } catch (err) {
          alert("Error reading JSON file.");
        }
      };
      fileReader.readAsText(event.target.files[0]);
    }

    // ---- Wire up UI ----------------------------------------------------------
    document.getElementById("randomBtn").addEventListener("click", showRandomQuote);
    document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
    document.getElementById("importFile").addEventListener("change", importFromJsonFile);

    loadQuotes();
    createAddQuoteForm();

    // ---- Restore last viewed quote from sessionStorage -----------------------
    const lastQuote = sessionStorage.getItem("lastQuote");
    if (lastQuote) {
      const { text, category } = JSON.parse(lastQuote);
      document.getElementById("quoteDisplay").innerHTML = `"${text}" — [${category}]`;
    }
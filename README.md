# DOM Manipulation, Web Storage, and Working with JSON Data  
---

## 📌 Project Overview  

This project was focused on creating a **Dynamic Quote Generator** web application using **JavaScript, DOM manipulation, web storage, and JSON data handling**.  

The application allows users to generate random quotes, add new quotes, filter them by category, and persist data across browser sessions. It also includes the ability to import/export quotes as JSON files and sync local data with a simulated server.  

---

## 🚀 What I Built  

### 🔹 1. Dynamic Quote Generator  
- Designed a clean `index.html` structure with placeholders for dynamic content.  
- Implemented **JavaScript DOM manipulation** to:  
  - Display random quotes.  
  - Add new quotes through a form.  
  - Dynamically update the DOM whenever quotes were added or filtered.  
- Managed quotes as an array of objects, each with `text` and `category` fields.  

---

### 🔹 2. Web Storage Integration  
- Used **local storage** to persist the quotes array so data remained available even after refreshing or reopening the browser.  
- Used **session storage** to track session-based preferences (like the last viewed quote).  
- Ensured that existing quotes were loaded from storage whenever the app initialized.  

---

### 🔹 3. JSON Data Import & Export  
- Added an **export feature** that lets users download their quotes as a JSON file.  
- Implemented an **import feature** using the File API and `FileReader` to upload JSON files.  
- Imported data was merged into the existing quotes array and saved back into local storage.  

---

### 🔹 4. Dynamic Filtering by Category  
- Introduced a **category filter dropdown** that updates automatically whenever a new category is added.  
- Implemented `populateCategories()` to generate category options dynamically.  
- Built a filtering system so users could view quotes from a specific category.  
- Saved the user’s **last selected filter** in local storage so it restored on page reload.  

---

### 🔹 5. Data Syncing & Conflict Resolution  
- Simulated a **server sync** using a mock API.  
- Implemented periodic data fetching to check for updates from the server.  
- Applied a **server-precedence conflict resolution model**: server data overrode local discrepancies.  
- Added basic user notifications to indicate when conflicts were resolved or updates were applied.  

---

## 📂 Project Structure  

alx_fe_javascript/
│
└── dom-manipulation/
    ├── index.html      # Main HTML file
    ├── script.js       # Core JavaScript functionality
    ├── style.css       # (Optional) Styling
    └── README.md       # Documentation

---

## 🖼️ Demo Features  

- **Show New Quote:** Displays a random quote.  
- **Add Quote:** Users can input a new quote and category.  
- **Filter Quotes:** Quotes displayed by selected category.  
- **Import/Export JSON:** Save and load quotes seamlessly.  
- **Persistent Storage:** Quotes survive page reloads.  
- **Server Sync:** Periodically checks and updates quotes from a simulated server.  

---

## ✅ Outcome  

By the end of the project, I successfully built a **fully interactive, persistent, and dynamic web application** that demonstrates:  

- Advanced DOM manipulation techniques.  
- Practical use of **localStorage** and **sessionStorage**.  
- Handling of **JSON data** for import/export.  
- Real-world concepts of **filtering, syncing, and conflict resolution**.  

This project strengthened my understanding of **JavaScript, browser storage, and data handling**, giving me confidence to build more interactive web applications.  

---

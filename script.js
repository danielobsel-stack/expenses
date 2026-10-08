const STORAGE_KEY = "expense-app-expenses";

const form = document.getElementById("expense-form");
const itemInput = document.getElementById("item-name");
const amountInput = document.getElementById("item-cost");
const expensesDiv = document.getElementById("expenses");
const totalExpenses = document.getElementById("total-expenses");
const emptyState = document.getElementById("empty-state");
const clearAllButton = document.getElementById("clear-all");

let expenses = loadExpenses();

function loadExpenses() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Could not load expenses:", error);
        return [];
    }
}

function saveExpenses() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}

function renderExpenses() {
    expensesDiv.innerHTML = "";

    let total = 0;

    expenses.forEach((expense) => {
        total += expense.amount;

        const expenseDiv = document.createElement("div");
        expenseDiv.className = "expense";

        const info = document.createElement("div");
        info.className = "expense-info";

        const name = document.createElement("span");
        name.className = "expense-name";
        name.textContent = expense.description;

        const amount = document.createElement("span");
        amount.className = "expense-amount";
        amount.textContent = formatCurrency(expense.amount);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteExpense(expense.id));

        info.appendChild(name);
        info.appendChild(amount);
        expenseDiv.appendChild(info);
        expenseDiv.appendChild(deleteButton);
        expensesDiv.appendChild(expenseDiv);
    });

    totalExpenses.textContent = formatCurrency(total);
    emptyState.hidden = expenses.length > 0;
}

function addExpense(description, amount) {
    expenses.push({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        description,
        amount
    });

    saveExpenses();
    renderExpenses();
}

function deleteExpense(id) {
    expenses = expenses.filter((expense) => expense.id !== id);
    saveExpenses();
    renderExpenses();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const description = itemInput.value.trim();
    const amount = Number.parseFloat(amountInput.value);

    if (!description || !Number.isFinite(amount) || amount <= 0) {
        return;
    }

    addExpense(description, amount);

    itemInput.value = "";
    amountInput.value = "";
    itemInput.focus();
});

clearAllButton.addEventListener("click", () => {
    if (expenses.length === 0) {
        return;
    }

    if (window.confirm("Delete all saved expenses?")) {
        expenses = [];
        saveExpenses();
        renderExpenses();
    }
});

renderExpenses();

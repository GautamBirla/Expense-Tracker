// DOM elements
const balance = document.getElementById('balance');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const ctx = document.getElementById('expense-chart').getContext('2d');

// Data
let transactions = [];

// Functions
function addTransaction(text, amount) {
    transactions.push({ text, amount });
    updateBalance();
    updateHistory();
    updateChart();
}

function updateBalance() {
    const total = transactions.reduce((acc, item) => acc + item.amount, 0).toFixed(2);
    balance.textContent = total;
}

function updateHistory() {
    expenseList.innerHTML = '';
    transactions.forEach(transaction => {
        const sign = transaction.amount < 0 ? '-' : '+';
        const item = document.createElement('li');
        item.classList.add('list-item');
        item.classList.add(transaction.amount < 0 ? 'delete' : 'income');
        item.innerHTML = `
            <span class="expense-text">${transaction.text}</span>
            <span class="expense-amount">${sign}₹${Math.abs(transaction.amount)}</span>
            <button class="delete-btn" onclick="removeTransaction(${transactions.indexOf(transaction)})">x</button>
        `;
        expenseList.appendChild(item);
    });
}

function removeTransaction(index) {
    transactions.splice(index, 1);
    updateBalance();
    updateHistory();
    updateChart();
}

function updateChart() {
    if (myChart) {
        myChart.destroy(); // Destroy existing chart before re-rendering
    }

    const labels = transactions.map(transaction => transaction.text);
    const amounts = transactions.map(transaction => Math.abs(transaction.amount));

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Amount',
                data: amounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

// Event listeners
form.addEventListener('submit', e => {
    e.preventDefault();

    const expenseText = text.value.trim();
    const expenseAmount = +amount.value.trim();

    if (expenseText === '' || expenseAmount === '') return;

    addTransaction(expenseText, expenseAmount);

    text.value = '';
    amount.value = '';
});

// Initial function calls
updateBalance();

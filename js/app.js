// ==================== DOM ELEMENTS ====================
const signinPage = document.getElementById('signin-page');
const signupPage = document.getElementById('signup-page');
const mainApp = document.getElementById('main-app');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const toSignupLink = document.getElementById('to-signup');
const toSigninLink = document.getElementById('to-signin');
const signoutBtn = document.getElementById('signout-btn');

const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page');
const addExpenseBtn = document.querySelector('.add-expense-btn');
const addExpenseModal = document.getElementById('add-expense-modal');
const closeModalBtn = document.querySelector('.close-modal');
const addExpenseForm = document.getElementById('add-expense-form');
const expensesTableBody = document.getElementById('expenses-table-body');
const customSelect = document.querySelector('.custom-select');
const selectSelected = document.querySelector('.select-selected');
const selectItems = document.querySelector('.select-items');

// ==================== SAMPLE DATA ====================
const expensesData = [
    { name: "Egg Head", price: 16.80, date: "Jan 23, 2023", category: "food" },
    { name: "Grocery for Home", price: 2.76, date: "Jan 23, 2023", category: "grocery" },
    { name: "Food", price: 2.40, date: "Jan 22, 2023", category: "food" },
    { name: "Codashop", price: 21.59, date: "Jan 20, 2023", category: "entertainment" },
    { name: "Electric Recliner Sofa", price: 270.00, date: "Jan 10, 2023", category: "shopping" },
    { name: "Swiggy", price: 2.40, date: "Jan 09, 2023", category: "food" },
    { name: "House Rent", price: 360.00, date: "Jan 03, 2023", category: "rent" },
    { name: "Swiggy", price: 26.40, date: "Dec 29, 2022", category: "food" },
    { name: "Zepto", price: 9.59, date: "Dec 22, 2022", category: "grocery" },
    { name: "Dress", price: 94.79, date: "Dec 22, 2022", category: "shopping" }
];

const subscriptionsData = [
    { name: "Netflix", price: 5.99, renewalDate: "Feb 15, 2023", category: "netflix" },
    { name: "Google Ads", price: 3.59, renewalDate: "Feb 10, 2023", category: "ads" },
    { name: "Test Subscription", price: 1.49, renewalDate: "Feb 05, 2023", category: "test" }
];

// Add new data arrays
const incomeData = [];
const investmentData = [];
const documentsData = [];

// ==================== AUTH LOGIC ====================
function setupAuthEventListeners() {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const toSignupLink = document.getElementById('to-signup');
    const toSigninLink = document.getElementById('to-signin');
    const signoutBtn = document.getElementById('signout-btn');
    const signinPage = document.getElementById('signin-page');
    const signupPage = document.getElementById('signup-page');
    const mainApp = document.getElementById('main-app');

    // Handle signup
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value.trim();

        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        // Store user data
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPassword', password);
        localStorage.setItem('userLoggedIn', 'true');

        // Clear the form
        signupForm.reset();

        // Hide auth pages and show main app
        signinPage.style.display = 'none';
        signupPage.style.display = 'none';
        mainApp.style.display = 'flex';

        // Initialize the dashboard
        populateExpensesTable();
        initializeExpenseChart();
        initializeSubscriptionChart();
        initializeTopExpensesTable();
        initializeRecentActivityTable();
        updateSummaryCards();
    });

    // Handle signin
    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signin-email').value.trim();
        const password = document.getElementById('signin-password').value.trim();

        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        const storedEmail = localStorage.getItem('userEmail');
        const storedPassword = localStorage.getItem('userPassword');

        if (email === storedEmail && password === storedPassword) {
            localStorage.setItem('userLoggedIn', 'true');
            
            // Clear the form
            signinForm.reset();
            
            // Hide auth pages and show main app
            signinPage.style.display = 'none';
            signupPage.style.display = 'none';
            mainApp.style.display = 'flex';

            // Initialize the dashboard
            populateExpensesTable();
            initializeExpenseChart();
            initializeSubscriptionChart();
            initializeTopExpensesTable();
            initializeRecentActivityTable();
            updateSummaryCards();
        } else {
            alert('Invalid email or password');
            // Clear the password field
            document.getElementById('signin-password').value = '';
        }
    });

    // Handle signout
    signoutBtn.addEventListener('click', () => {
        localStorage.removeItem('userLoggedIn');
        mainApp.style.display = 'none';
        signinPage.style.display = 'flex';
        signupPage.style.display = 'none';
        
        // Clear the signin form
        signinForm.reset();
    });

    // Handle navigation between auth pages
    toSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        signinPage.style.display = 'none';
        signupPage.style.display = 'flex';
        // Clear the signin form
        signinForm.reset();
    });

    toSigninLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupPage.style.display = 'none';
        signinPage.style.display = 'flex';
        // Clear the signup form
        signupForm.reset();
    });

    // Check if user is already logged in
    function checkLoginStatus() {
        if (localStorage.getItem('userLoggedIn') === 'true') {
            signinPage.style.display = 'none';
            signupPage.style.display = 'none';
            mainApp.style.display = 'flex';
        } else {
            signinPage.style.display = 'flex';
            signupPage.style.display = 'none';
            mainApp.style.display = 'none';
        }
    }

    // Initial check
    checkLoginStatus();

    // Add event listener for storage changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'userLoggedIn') {
            checkLoginStatus();
        }
    });
}

// ==================== EXPENSE TABLE ====================
function populateExpensesTable() {
    expensesTableBody.innerHTML = '';
    expensesData.forEach((expense, index) => {
        const row = document.createElement('tr');
        let categoryIcon = {
            food: '🍔', grocery: '🛒', entertainment: '🎮',
            shopping: '🛍️', rent: '🏠'
        }[expense.category] || '📝';

        row.innerHTML = `
            <td><span class="category-icon">${categoryIcon}</span> ${expense.name}</td>
            <td>$${expense.price.toFixed(2)}</td>
            <td>${expense.date}</td>
            <td><button class="delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button></td>
        `;
        expensesTableBody.appendChild(row);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            deleteExpense(index);
        });
    });
}

function deleteExpense(index) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expensesData.splice(index, 1);
        populateExpensesTable();
        updateExpenseChart();
        initializeTopExpensesTable();
        initializeRecentActivityTable();
        updateSummaryCards();
    }
}

// ==================== CHARTS & DATA ====================
function initializeExpenseChart() {
    const ctx = document.createElement('canvas');
    document.getElementById('expense-chart').innerHTML = '';
    document.getElementById('expense-chart').appendChild(ctx);

    const grouped = {};
    expensesData.forEach(exp => grouped[exp.date] = (grouped[exp.date] || 0) + exp.price);

    const labels = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
    const chartData = {
        labels,
        datasets: [{
            label: 'Expenses',
            data: labels.map(d => grouped[d]),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `$${value.toLocaleString()}`
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: context => `$${context.raw.toLocaleString()}`
                    }
                }
            }
        }
    });
}

function initializeSubscriptionChart() {
    const ctx = document.createElement('canvas');
    document.getElementById('subscription-chart').innerHTML = '';
    document.getElementById('subscription-chart').appendChild(ctx);

    const byCategory = {};
    subscriptionsData.forEach(sub => byCategory[sub.category] = (byCategory[sub.category] || 0) + sub.price);
    const labels = Object.keys(byCategory);
    const data = labels.map(cat => byCategory[cat]);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)'
                ]
            }]
        },
        options: {
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: context => `${context.label}: $${context.raw.toLocaleString()}`
                    }
                }
            },
            cutout: '70%'
        }
    });

    const total = subscriptionsData.reduce((sum, sub) => sum + sub.price, 0);
    const centerText = document.createElement('div');
    centerText.textContent = `$${total.toFixed(2)}`;
    centerText.className = 'chart-center-text';
    Object.assign(centerText.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        fontSize: '1.2rem',
        fontWeight: 'bold'
    });

    const chartContainer = document.getElementById('subscription-chart');
    chartContainer.style.position = 'relative';
    chartContainer.appendChild(centerText);
}

// ==================== UI INIT ====================
function initializeTopExpensesTable() {
    const table = document.getElementById('top-expenses-table');
    table.innerHTML = '';
    const grouped = {};

    expensesData.forEach(exp => grouped[exp.category] = (grouped[exp.category] || 0) + exp.price);
    const sorted = Object.entries(grouped).map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount);

    sorted.forEach(exp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><div class="category-bar ${exp.category}"><span>${exp.category}</span></div></td>
            <td>$${exp.amount.toFixed(2)}</td>
        `;
        table.appendChild(row);
    });
}

function initializeRecentActivityTable() {
    const table = document.getElementById('recent-activity-table');
    table.innerHTML = '';
    expensesData.slice(0, 5).forEach((exp, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}.</td>
            <td>${exp.name}</td>
            <td>${exp.category}</td>
            <td>$${exp.price.toFixed(2)}</td>
        `;
        table.appendChild(row);
    });
}

function updateSummaryCards() {
    // Calculate totals
    const totalIncome = 458000.00; // This would come from your income data
    const totalExpenses = expensesData.reduce((sum, exp) => sum + exp.price, 0);
    const totalInvestments = 24000.00; // This would come from your investments data
    const totalSpent = totalExpenses + totalInvestments;
    const availableBalance = totalIncome - totalSpent;

    // Update overview summary cards
    document.querySelector('.summary-card:nth-child(1) .card-value').textContent = `$${totalIncome.toFixed(2)}`;
    document.querySelector('.summary-card:nth-child(2) .card-value').textContent = `$${totalSpent.toFixed(2)}`;
    document.querySelector('.summary-card:nth-child(3) .card-value').textContent = `$${availableBalance.toFixed(2)}`;
    document.querySelector('.summary-card:nth-child(4) .card-value').textContent = `$${totalExpenses.toFixed(2)}`;
    document.querySelector('.summary-card:nth-child(5) .card-value').textContent = `$${totalInvestments.toFixed(2)}`;

    // Update expenses page summary
    if (document.getElementById('expenses').classList.contains('active')) {
        const expensesSummary = document.querySelector('#expenses .summary-cards');
        expensesSummary.querySelector('.card-value').textContent = expensesData.length.toString();
        expensesSummary.querySelectorAll('.card-value')[1].textContent = `$${totalExpenses.toFixed(2)}`;
    }
}

// ==================== SETUP EVENT LISTENERS ====================
function setupEventListeners() {
    menuItems.forEach(item => {
        if (item.classList.contains('signout-btn')) return;
        item.addEventListener('click', function () {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            pages.forEach(page => {
                page.classList.toggle('active', page.id === this.getAttribute('data-page'));
            });
        });
    });

    addExpenseBtn.addEventListener('click', () => {
        addExpenseModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        addExpenseModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === addExpenseModal) addExpenseModal.style.display = 'none';
    });

    selectSelected.addEventListener('click', function (e) {
        e.stopPropagation();
        closeAllSelect(this);
        selectItems.classList.toggle('select-hide');
        this.classList.toggle('select-arrow-active');
    });

    selectItems.querySelectorAll('div').forEach(option => {
        option.addEventListener('click', function () {
            selectSelected.innerHTML = this.innerHTML;
            selectItems.classList.add('select-hide');
        });
    });

    document.addEventListener('click', closeAllSelect);

    addExpenseForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('expense-name').value;
        const price = parseFloat(document.getElementById('expense-price').value);
        const date = formatDate(document.getElementById('expense-date').value);
        const category = selectSelected.innerHTML.toLowerCase();
        const notes = document.getElementById('expense-notes').value;

        expensesData.unshift({ name, price, date, category, notes });

        // Update all relevant displays
        populateExpensesTable();
        initializeExpenseChart();
        initializeSubscriptionChart();
        initializeTopExpensesTable();
        initializeRecentActivityTable();
        updateSummaryCards();
        updateAnalyticsCharts(document.getElementById('time-range').value);

        addExpenseModal.style.display = 'none';
        addExpenseForm.reset();
        selectSelected.innerHTML = 'Select';
    });
}

function closeAllSelect(current) {
    document.querySelectorAll('.select-items').forEach(el => {
        if (el !== current) el.classList.add('select-hide');
    });
    document.querySelectorAll('.select-selected').forEach(el => {
        if (el !== current) el.classList.remove('select-arrow-active');
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ==================== PAGE NAVIGATION ====================
function setupPageNavigation() {
    menuItems.forEach(item => {
        if (item.classList.contains('signout-btn')) return;
        
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            
            // Update active states
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === targetPage) {
                    page.classList.add('active');
                    initializePage(targetPage);
                }
            });
        });
    });
}

function initializePage(pageId) {
    switch(pageId) {
        case 'overview':
            updateSummaryCards();
            initializeExpenseChart();
            initializeSubscriptionChart();
            initializeTopExpensesTable();
            initializeRecentActivityTable();
            break;
            
        case 'finances':
            initializeTransactionsTable();
            break;
            
        case 'analytics':
            initializeAnalyticsCharts();
            break;
            
        case 'profile':
            initializeProfileData();
            break;
    }
}

// ==================== FINANCES PAGE ====================
function initializeTransactionsTable() {
    const tbody = document.querySelector('#transactions-table tbody');
    tbody.innerHTML = '';
    
    // Combine expenses and income into transactions
    const transactions = [
        ...expensesData.map(exp => ({
            date: exp.date,
            type: 'Expense',
            description: exp.name,
            amount: -exp.price
        })),
        // Add your income transactions here
    ];
    
    // Sort by date descending
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    transactions.forEach(trans => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trans.date}</td>
            <td>${trans.type}</td>
            <td>${trans.description}</td>
            <td class="${trans.amount < 0 ? 'expense' : 'income'}">
                ${trans.amount < 0 ? '-' : ''}$${Math.abs(trans.amount).toFixed(2)}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ==================== ANALYTICS PAGE ====================
function initializeAnalyticsCharts() {
    // Expense Trends Chart
    const trendCtx = document.getElementById('expense-trends-chart');
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Expenses',
                data: [1200, 1900, 1500, 1800, 2200, 1600],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `$${value}`
                    }
                }
            }
        }
    });

    // Category Distribution Chart
    const distCtx = document.getElementById('category-distribution-chart');
    const categoryData = {};
    expensesData.forEach(exp => {
        categoryData[exp.category] = (categoryData[exp.category] || 0) + exp.price;
    });

    new Chart(distCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// ==================== PROFILE PAGE ====================
function initializeProfileData() {
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    
    // Load saved user data
    nameInput.value = localStorage.getItem('userName') || '';
    emailInput.value = localStorage.getItem('userEmail') || '';
    
    // Handle profile form submission
    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        localStorage.setItem('userName', nameInput.value);
        localStorage.setItem('userEmail', emailInput.value);
        alert('Profile updated successfully!');
    });
}

// ==================== INCOME & INVESTMENT LOGIC ====================
function setupFinanceEventListeners() {
    const addIncomeBtn = document.querySelector('.add-income-btn');
    const addInvestmentBtn = document.querySelector('.add-investment-btn');
    const incomeModal = document.getElementById('add-income-modal');
    const investmentModal = document.getElementById('add-investment-modal');
    const incomeForm = document.getElementById('add-income-form');
    const investmentForm = document.getElementById('add-investment-form');

    addIncomeBtn.addEventListener('click', () => {
        incomeModal.style.display = 'block';
    });

    addInvestmentBtn.addEventListener('click', () => {
        investmentModal.style.display = 'block';
    });

    incomeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const source = document.getElementById('income-source').value;
        const amount = parseFloat(document.getElementById('income-amount').value);
        const date = formatDate(document.getElementById('income-date').value);
        const type = document.querySelector('#add-income-modal .select-selected').textContent;
        const notes = document.getElementById('income-notes').value;

        incomeData.unshift({ source, amount, date, type, notes });
        updateFinancialData();
        incomeModal.style.display = 'none';
        incomeForm.reset();
    });

    investmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('investment-name').value;
        const amount = parseFloat(document.getElementById('investment-amount').value);
        const date = formatDate(document.getElementById('investment-date').value);
        const type = document.querySelector('#add-investment-modal .select-selected').textContent;
        const notes = document.getElementById('investment-notes').value;

        investmentData.unshift({ name, amount, date, type, notes });
        updateFinancialData();
        investmentModal.style.display = 'none';
        investmentForm.reset();
    });
}

function updateFinancialData() {
    const totalIncome = incomeData.reduce((sum, inc) => sum + inc.amount, 0);
    const totalInvestments = investmentData.reduce((sum, inv) => sum + inv.amount, 0);
    const totalExpenses = expensesData.reduce((sum, exp) => sum + exp.price, 0);
    
    // Update summary cards
    document.querySelector('.summary-card:nth-child(1) .card-value').textContent = `$${totalIncome.toFixed(2)}`;
    document.querySelector('.summary-card:nth-child(5) .card-value').textContent = `$${totalInvestments.toFixed(2)}`;
    
    // Update finance cards
    document.querySelector('.finance-card:nth-child(1) .finance-amount').textContent = `$${totalIncome.toFixed(2)}`;
    document.querySelector('.finance-card:nth-child(2) .finance-amount').textContent = `$${totalInvestments.toFixed(2)}`;
    
    // Update transactions table
    initializeTransactionsTable();
}

// ==================== DOCUMENTS LOGIC ====================
function setupDocumentsEventListeners() {
    const uploadBtn = document.querySelector('.upload-doc-btn');
    const uploadModal = document.getElementById('upload-document-modal');
    const uploadForm = document.getElementById('upload-document-form');
    const searchInput = document.querySelector('.search-box input');
    const fileInput = document.getElementById('document-file');
    const dropZone = document.querySelector('.file-upload-placeholder');

    uploadBtn.addEventListener('click', () => {
        uploadModal.style.display = 'block';
    });

    // File drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        fileInput.files = e.dataTransfer.files;
        updateFileUploadUI(fileInput.files[0].name);
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            updateFileUploadUI(fileInput.files[0].name);
        }
    });

    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('document-name').value;
        const category = document.querySelector('#upload-document-modal .select-selected').textContent;
        const file = fileInput.files[0];

        documentsData.unshift({
            name,
            category,
            fileName: file.name,
            date: new Date().toLocaleDateString(),
            size: formatFileSize(file.size)
        });

        updateDocumentsGrid();
        uploadModal.style.display = 'none';
        uploadForm.reset();
        resetFileUploadUI();
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const documents = document.querySelectorAll('.document-card');
        
        documents.forEach(doc => {
            const name = doc.querySelector('h3').textContent.toLowerCase();
            const category = doc.querySelector('.document-category').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || category.includes(searchTerm)) {
                doc.style.display = 'block';
            } else {
                doc.style.display = 'none';
            }
        });
    });
}

function updateFileUploadUI(fileName) {
    const placeholder = document.querySelector('.file-upload-placeholder');
    placeholder.innerHTML = `
        <i class="fas fa-file"></i>
        <span>${fileName}</span>
    `;
}

function resetFileUploadUI() {
    const placeholder = document.querySelector('.file-upload-placeholder');
    placeholder.innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <span>Drag & Drop or Click to Upload</span>
    `;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateDocumentsGrid() {
    const grid = document.querySelector('.documents-grid');
    grid.innerHTML = '';

    documentsData.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'document-card';
        card.innerHTML = `
            <div class="document-icon">
                <i class="fas fa-file-alt"></i>
            </div>
            <h3>${doc.name}</h3>
            <div class="document-info">
                <span class="document-category">${doc.category}</span>
                <span class="document-date">${doc.date}</span>
                <span class="document-size">${doc.size}</span>
            </div>
            <div class="document-actions">
                <button class="view-btn"><i class="fas fa-eye"></i></button>
                <button class="download-btn"><i class="fas fa-download"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ==================== ANALYTICS LOGIC ====================
function setupAnalyticsEventListeners() {
    const timeRange = document.getElementById('time-range');
    
    timeRange.addEventListener('change', () => {
        updateAnalyticsCharts(timeRange.value);
    });
}

function filterExpensesByDateRange(expenses, range) {
    const now = new Date();
    let startDate;

    switch(range) {
        case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'month':
            startDate = new Date(now.setDate(now.getDate() - 30));
            break;
        case 'year':
            startDate = new Date(now.setDate(now.getDate() - 365));
            break;
        default:
            return expenses; // Return all expenses for 'all' option
    }

    return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate;
    });
}

function updateAnalyticsCharts(timeRange) {
    const filteredExpenses = filterExpensesByDateRange(expensesData, timeRange);
    
    // Clear existing charts
    if (expenseChart) expenseChart.destroy();
    if (subscriptionChart) subscriptionChart.destroy();

    // Update expense distribution chart
    const expenseCtx = document.getElementById('expense-chart').getContext('2d');
    const expenseData = processExpenseData(filteredExpenses);
    expenseChart = new Chart(expenseCtx, {
        type: 'doughnut',
        data: {
            labels: expenseData.labels,
            datasets: [{
                data: expenseData.values,
                backgroundColor: expenseData.colors
            }]
        },
        options: chartOptions
    });

    // Update subscription trend chart
    const subCtx = document.getElementById('subscription-chart').getContext('2d');
    const subData = processSubscriptionData(filteredExpenses);
    subscriptionChart = new Chart(subCtx, {
        type: 'line',
        data: {
            labels: subData.labels,
            datasets: [{
                label: 'Monthly Expenses',
                data: subData.values,
                borderColor: '#4CAF50',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Update tables with filtered data
    updateTopExpensesTable(filteredExpenses);
    updateRecentActivityTable(filteredExpenses);
}

function updateExpenseTrendsChart(expenses, timeRange) {
    const ctx = document.getElementById('expense-trends-chart');
    const chartData = processExpenseTrendsData(expenses, timeRange);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Expenses',
                data: chartData.data,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `$${value}`
                    }
                }
            }
        }
    });
}

function processExpenseTrendsData(expenses, timeRange) {
    const data = {};
    let format;

    switch(timeRange) {
        case 'week':
            format = 'MM/DD';
            break;
        case 'month':
            format = 'MM/DD';
            break;
        case 'year':
            format = 'MMM';
            break;
    }

    expenses.forEach(exp => {
        const date = new Date(exp.date);
        const key = date.toLocaleDateString('en-US', {
            month: format === 'MMM' ? 'short' : '2-digit',
            day: format === 'MMM' ? undefined : '2-digit'
        });
        data[key] = (data[key] || 0) + exp.price;
    });

    return {
        labels: Object.keys(data),
        data: Object.values(data)
    };
}

function setupModalClosing() {
    // Get all close buttons and modals
    const closeButtons = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('.modal');

    // Add click event for each close button
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.style.display = 'none';
            // Reset form if exists
            const form = modal.querySelector('form');
            if (form) form.reset();
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                // Reset form if exists
                const form = modal.querySelector('form');
                if (form) form.reset();
            }
        });
    });
}

function setupProfilePicture() {
    const avatarInput = document.createElement('input');
    avatarInput.type = 'file';
    avatarInput.accept = 'image/*';
    avatarInput.style.display = 'none';
    document.body.appendChild(avatarInput);

    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    const profileImage = document.querySelector('.profile-avatar img');

    changeAvatarBtn.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImage.src = e.target.result;
                // Store in localStorage
                localStorage.setItem('profilePicture', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Load saved profile picture on page load
    const savedProfilePicture = localStorage.getItem('profilePicture');
    if (savedProfilePicture) {
        profileImage.src = savedProfilePicture;
    }
}

function setupDateFilter() {
    const dateRangeText = document.getElementById('date-range-text');
    const dropdown = document.querySelector('.dropdown span');
    const dropdownIcon = document.querySelector('.dropdown i');
    
    function updateDateRange(range) {
        const now = new Date();
        let startDate, endDate;
        
        switch(range) {
            case 'Month to Date':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = now;
                break;
            case 'Last Month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case 'Last 3 Months':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                endDate = now;
                break;
            case 'Last Year':
                startDate = new Date(now.getFullYear() - 1, 0, 1);
                endDate = new Date(now.getFullYear() - 1, 11, 31);
                break;
        }
        
        const formatDate = (date) => {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        };
        
        dateRangeText.textContent = `${formatDate(startDate)} - ${formatDate(endDate)}`;
        updateAnalyticsCharts();
    }
    
    // Handle dropdown click
    document.querySelector('.dropdown').addEventListener('click', () => {
        const options = ['Month to Date', 'Last Month', 'Last 3 Months', 'Last Year'];
        const currentIndex = options.indexOf(dropdown.textContent);
        const nextIndex = (currentIndex + 1) % options.length;
        dropdown.textContent = options[nextIndex];
        updateDateRange(options[nextIndex]);
    });
    
    // Handle feedback button
    document.querySelector('.feedback-btn').addEventListener('click', () => {
        const feedback = prompt('Please provide your feedback:');
        if (feedback) {
            alert('Thank you for your feedback!');
            // Here you would typically send the feedback to your backend
        }
    });
}

function updateTopExpensesTable(expenses = expensesData) {
    const table = document.getElementById('top-expenses-table');
    table.innerHTML = '';
    
    // Group expenses by category
    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.price;
    });
    
    // Sort categories by total amount
    const sortedCategories = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a);
    
    // Create table rows
    sortedCategories.forEach(([category, total]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="category-bar ${category}">
                    <span>${category}</span>
                </div>
            </td>
            <td>$${total.toFixed(2)}</td>
        `;
        table.appendChild(row);
    });
}

function setupSummaryCards() {
    const summaryCards = document.querySelectorAll('.summary-card');
    
    summaryCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.card-title').textContent;
            const value = card.querySelector('.card-value').textContent;
            
            // Create modal for detailed view
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = 'summary-details-modal';
            
            let content = '';
            switch(title) {
                case 'TOTAL SPENT':
                    content = generateSpentDetails();
                    break;
                case 'TOTAL EXPENSES':
                    content = generateExpensesDetails();
                    break;
                case 'TOTAL INCOME':
                    content = generateIncomeDetails();
                    break;
                case 'TOTAL INVESTMENTS':
                    content = generateInvestmentsDetails();
                    break;
                case 'AVAILABLE BALANCE':
                    content = generateBalanceDetails();
                    break;
            }
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${title} Details</h2>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            modal.style.display = 'block';
            
            // Handle modal closing
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.remove();
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    });
}

function generateSpentDetails() {
    const expenses = expensesData;
    const income = incomeData;
    const investments = investmentData;
    
    let html = `
        <div class="summary-details">
            <h3>Total Spent: $${(expenses.reduce((sum, exp) => sum + exp.price, 0) + 
                investments.reduce((sum, inv) => sum + inv.amount, 0)).toFixed(2)}</h3>
            <div class="details-section">
                <h4>Expenses</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // Group expenses by category
    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.price;
    });
    
    Object.entries(categoryTotals).forEach(([category, total]) => {
        html += `
            <tr>
                <td>${category}</td>
                <td>$${total.toFixed(2)}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
            <div class="details-section">
                <h4>Investments</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // Group investments by type
    const investmentTotals = {};
    investments.forEach(investment => {
        investmentTotals[investment.type] = (investmentTotals[investment.type] || 0) + investment.amount;
    });
    
    Object.entries(investmentTotals).forEach(([type, total]) => {
        html += `
            <tr>
                <td>${type}</td>
                <td>$${total.toFixed(2)}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    return html;
}

function generateIncomeDetails() {
    const income = incomeData;
    
    let html = `
        <div class="summary-details">
            <h3>Total Income: $${income.reduce((sum, inc) => sum + inc.amount, 0).toFixed(2)}</h3>
            <div class="details-section">
                <h4>Income Sources</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Source</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    income.forEach(inc => {
        html += `
            <tr>
                <td>${inc.source}</td>
                <td>$${inc.amount.toFixed(2)}</td>
                <td>${inc.date}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    return html;
}

function generateExpensesDetails() {
    const expenses = expensesData;
    
    let html = `
        <div class="summary-details">
            <h3>Total Expenses: $${expenses.reduce((sum, exp) => sum + exp.price, 0).toFixed(2)}</h3>
            <div class="details-section">
                <h4>Expenses by Category</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // Group expenses by category
    const categoryTotals = {};
    const categoryCounts = {};
    
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.price;
        categoryCounts[expense.category] = (categoryCounts[expense.category] || 0) + 1;
    });
    
    Object.entries(categoryTotals).forEach(([category, total]) => {
        html += `
            <tr>
                <td>${category}</td>
                <td>$${total.toFixed(2)}</td>
                <td>${categoryCounts[category]}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
            <div class="details-section">
                <h4>Recent Expenses</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // Show last 5 expenses
    expenses.slice(0, 5).forEach(expense => {
        html += `
            <tr>
                <td>${expense.name}</td>
                <td>$${expense.price.toFixed(2)}</td>
                <td>${expense.date}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    return html;
}

function generateInvestmentsDetails() {
    const investments = investmentData;
    
    let html = `
        <div class="summary-details">
            <h3>Total Investments: $${investments.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}</h3>
            <div class="details-section">
                <h4>Investments by Type</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    investments.forEach(investment => {
        html += `
            <tr>
                <td>${investment.type}</td>
                <td>$${investment.amount.toFixed(2)}</td>
                <td>${investment.date}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    return html;
}

function generateBalanceDetails() {
    const income = incomeData;
    const expenses = expensesData;
    const investments = investmentData;
    
    const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.price, 0);
    const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const availableBalance = totalIncome - totalExpenses - totalInvestments;
    
    let html = `
        <div class="summary-details">
            <h3>Available Balance: $${availableBalance.toFixed(2)}</h3>
            <div class="details-section">
                <h4>Balance Breakdown</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Total Income</td>
                            <td>$${totalIncome.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Total Expenses</td>
                            <td>-$${totalExpenses.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Total Investments</td>
                            <td>-$${totalInvestments.toFixed(2)}</td>
                        </tr>
                        <tr class="total-row">
                            <td>Available Balance</td>
                            <td>$${availableBalance.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    return html;
}

// ==================== INIT APP ====================
document.addEventListener('DOMContentLoaded', () => {
    setupAuthEventListeners();
    setupPageNavigation();
    setupFinanceEventListeners();
    setupDocumentsEventListeners();
    setupAnalyticsEventListeners();
    setupModalClosing();
    setupProfilePicture();
    setupDateFilter();
    setupSummaryCards();
    populateExpensesTable();
    initializeExpenseChart();
    initializeSubscriptionChart();
    initializeTopExpensesTable();
    initializeRecentActivityTable();
    updateSummaryCards();
});

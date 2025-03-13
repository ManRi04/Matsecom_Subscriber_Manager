// Tab Switching Logic
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to the clicked button and corresponding pane
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Manage Subscribers Form
const subscriberForm = document.getElementById('subscriber-form');
const subscriberTable = document.getElementById('subscriber-table').getElementsByTagName('tbody')[0];

subscriberForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const forename = document.getElementById('forename').value;
    const surname = document.getElementById('surname').value;
    const imsi = document.getElementById('imsi').value;
    const terminalType = document.getElementById('terminal-type').value;
    const subscriptionType = document.getElementById('subscription-type').value;

    // Add subscriber to the table
    const newRow = subscriberTable.insertRow();
    newRow.innerHTML = `
    <td>${forename}</td>
    <td>${surname}</td>
    <td>${imsi}</td>
    <td>${terminalType}</td>
    <td>${subscriptionType}</td>
    <td><button onclick="deleteSubscriber(this)">Delete</button></td>
  `;
    const data = {
        forename: forename,
        surname: surname,
        imsi: imsi,
        terminalType:terminalType,
        subscriptionType: subscriptionType,
    };
    fetch("http://localhost:63342/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(result => console.log("Erfolgreich gesendet:", result))
        .catch(error => console.error("Fehler:", error));

    // Clear the form
    subscriberForm.reset();
});

function deleteSubscriber(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

// Simulate Session Form
const sessionForm = document.getElementById('session-form');
const sessionResult = document.getElementById('session-result');

sessionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const subscriber = document.getElementById('subscriber-select').value;
    const serviceType = document.getElementById('service-type').value;
    const duration = document.getElementById('session-duration').value;

    // Display session result
    sessionResult.innerHTML = `
    <p>Session simulated for ${subscriber}.</p>
    <p>Service Type: ${serviceType}</p>
    <p>Duration: ${duration} minutes</p>
  `;
});

// Generate Invoice Form
const invoiceForm = document.getElementById('invoice-form');
const invoiceResult = document.getElementById('invoice-result');

invoiceForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const subscriber = document.getElementById('invoice-subscriber-select').value;

    // Display invoice result
    invoiceResult.innerHTML = `
    <p>Invoice generated for ${subscriber}.</p>
  `;
});
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

let subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];

function saveSubscribers() {
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
}

// Manage Forms
const subscriberForm = document.getElementById('subscriber-form');
const subscriberTable = document.getElementById('subscriber-table').getElementsByTagName('tbody')[0];
const sessionForm = document.getElementById('session-form');
const sessionResult = document.getElementById('session-result');
const invoiceForm = document.getElementById('invoice-form');
const invoiceResult = document.getElementById('invoice-result');

// Function to validate a form
function validateForm(formId) {
    let form = document.getElementById(formId);
    let isValid = true;

    if (!form) return false; // Falls das Formular nicht existiert

    // Forename & Surname Validation (Nur für subscriber-form)
    if (formId === "subscriber-form") {
        const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿÄÖÜäöüß]+$/;
        if (!validateInput(form.querySelector("#forename"), namePattern, "Invalid Forename!")) isValid = false;
        if (!validateInput(form.querySelector("#surname"), namePattern, "Invalid Surname!")) isValid = false;

        const imsiInput = form.querySelector("#imsi");
        const imsiValidation = validateImsi(imsiInput);

        if (!imsiValidation.valid) {
            isValid = false;
            let errorSpan = imsiInput.nextElementSibling;
            if (!errorSpan || !errorSpan.classList.contains("error-message")) {
                errorSpan = document.createElement("span");
                errorSpan.classList.add("error-message");
                imsiInput.parentNode.appendChild(errorSpan);
            }
            errorSpan.textContent = imsiValidation.message;
            errorSpan.classList.add("show-error");
            imsiInput.classList.add("error-border");
        }
    }

    // Duration Validation (Nur für session-form) - muss eine Zahl sein
    if (formId === "session-form") {
        const durationPattern = /^\d+$/;
        if (!validateInput(form.querySelector("#session-duration"), durationPattern, "Duration must be a number!")) isValid = false;
    }
    return isValid;
}


// Function to validate an input field
function validateInput(input, pattern, errorMessage) {
    if (!input) return true; // Falls das Eingabefeld nicht existiert, kein Fehler

    let value = input.value.trim();
    let errorSpan = input.nextElementSibling;

    if (!errorSpan || !errorSpan.classList.contains("error-message")) {
        errorSpan = document.createElement("span");
        errorSpan.classList.add("error-message");
        input.parentNode.appendChild(errorSpan);
    }

    if (!pattern.test(value)) {
        input.classList.add("error-border");
        errorSpan.textContent = errorMessage;
        errorSpan.classList.add("show-error");
        return false;
    } else {
        input.classList.remove("error-border");
        errorSpan.classList.remove("show-error");
        return true;
    }
}

const imsiPattern = /^[0-9]{5,15}$/; // Nur Zahlen, 5 bis 15 Zeichen lang
function validateImsi(input) {
    let value = input.value.trim();

    // Überprüfen, ob die Länge zwischen 5 und 15 Zeichen liegt
    if (!imsiPattern.test(value)) {
        return { valid: false, message: "IMSI must be between 5 and 15 digits long and must not contain any letters!" };
    }

    // Überprüfen, ob die IMSI mit MCC 262 (Deutschland) und MNC 42 (T-Mobile) beginnt
    if (!value.startsWith("26242")) {
        return { valid: false, message: "Invalid MCC/MNC." };
    }

    return { valid: true }; // Gültig, wenn alle Prüfungen bestehen
}

// Change Button Text and Clear Inputs After Submission
function resetForm(formId, buttonId, newButtonText) {
    const form = document.getElementById(formId);
    const button = document.getElementById(buttonId);
    form.reset(); // Clear inputs
    button.textContent = newButtonText; // Change button text
}

// Attach submit event listeners to each form
["subscriber-form", "session-form", "invoice-form"].forEach(formId => {
    let form = document.getElementById(formId);
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            if (validateForm(formId)) {
                if (formId === "subscriber-form") {
                    const forename = document.getElementById('forename').value;
                    const surname = document.getElementById('surname').value;
                    const imsi = document.getElementById('imsi').value;
                    const terminalType = document.getElementById('terminal-type').value;
                    const subscriptionType = document.getElementById('subscription-type').value;

                    // Create new subscriber object
                    const newSubscriber = {
                        forename,
                        surname,
                        imsi,
                        terminalType,
                        subscriptionType,
                        totalDataUsed: 0, // Initialize total data used
                        totalCharges: 0 // Initialize total charges
                    };

                    // Add subscriber to the array and save to localStorage
                    subscribers.push(newSubscriber);
                    saveSubscribers();

                    // Update the table and dropdowns
                    sortSubscribers();
                    updateSubscriberDropdowns();

                    // Clear the form
                    subscriberForm.reset();
                }
                else if(formId === "session-form") {
                    // Data Definitions
                    const terminals = {
                        "PhairPhone": ["2G", "3G"],
                        "Pear aphone 4s": ["2G", "3G"],
                        "Samsung s42plus": ["2G", "3G", "4G"]
                    };

                    const subscriptions = {
                        "GreenMobil S": { basicFee: 8, freeMinutes: 0, pricePerExtraMinute: 0.08, dataVolume: 500 },
                        "GreenMobil M": { basicFee: 22, freeMinutes: 100, pricePerExtraMinute: 0.06, dataVolume: 2000 },
                        "GreenMobil L": { basicFee: 42, freeMinutes: 150, pricePerExtraMinute: 0.04, dataVolume: 5000 }
                    };

                    const ranTechnologies = {
                        "2G": { maxThroughput: null, achievableThroughput: { good: null, medium: null, low: null, na: null }, voiceCallSupport: true },
                        "3G": { maxThroughput: 20, achievableThroughput: { good: 0.5, medium: 0.25, low: 0.1, na: 0 }, voiceCallSupport: false },
                        "4G": { maxThroughput: 300, achievableThroughput: { good: 0.5, medium: 0.25, low: 0.1, na: 0 }, voiceCallSupport: false }
                    };

                    const serviceTypes = {
                        "Voice call": { ranTechnologies: ["2G"], requiredDataRate: null },
                        "Browsing and social networking": { ranTechnologies: ["3G", "4G"], requiredDataRate: 2 },
                        "App download": { ranTechnologies: ["3G", "4G"], requiredDataRate: 10 },
                        "Adaptive HD video": { ranTechnologies: ["3G", "4G"], requiredDataRate: 75 }
                    };

                    // Simulate Session Form
                    const sessionForm = document.getElementById('session-form');
                    const sessionResult = document.getElementById('session-result');

                    const subscriberIndex = document.getElementById('subscriber-select').value;
                    const serviceType = document.getElementById('service-type').value;
                    const duration = parseInt(document.getElementById('session-duration').value);
                    const subscriber = subscribers[subscriberIndex];

                    // Simulate session
                    if (serviceType === "Voice call") {
                        simulateVoiceCall(subscriber, duration);
                    } else {
                        simulateDataSession(subscriber, duration, serviceType);
                    }

                    resetForm('session-form', 'session-submit-button', 'Create New Session');

                    // Simulate Voice Call
                    function simulateVoiceCall(subscriber, duration) {
                        const subscription = subscriptions[subscriber.subscriptionType];
                        const freeMinutes = subscription.freeMinutes;
                        const extraMinutes = Math.max(0, duration - freeMinutes);
                        const totalCharges = (extraMinutes * subscription.pricePerExtraMinute).toFixed(2);

                        subscriber.totalCharges += parseFloat(totalCharges);

                        // Display session details
                        document.getElementById('session-subscriber-name').textContent = `${subscriber.forename} ${subscriber.surname}`;
                        document.getElementById('session-service-type').textContent = "Voice Call";
                        document.getElementById('session-duration-display').textContent = `${duration} minutes`;
                        document.getElementById('voice-total-charges').textContent = `€${totalCharges}`;

                        // Show voice call details and hide data session details
                        document.getElementById('voice-call-details').classList.remove('hidden');
                        document.getElementById('data-session-details').classList.add('hidden');
                        document.getElementById('session-result').classList.remove('hidden');
                    }

                    // Simulate Data Session
                    function simulateDataSession(subscriber, duration, serviceType) {
                        const signalStrength = ["good", "medium", "low", "na"][Math.floor(Math.random() * 4)];
                        const availableRANTechnologies = terminals[subscriber.terminalType].filter(tech => serviceTypes[serviceType].ranTechnologies.includes(tech));
                        let ranTechnology;
                        if(serviceType === "Adaptive HD video" && terminal === "Samsung s42plus") {
                            ranTechnology = "4G"
                        }
                        else {
                            ranTechnology = availableRANTechnologies[Math.floor(Math.random() * availableRANTechnologies.length)];
                        }
                        const maxThroughput = ranTechnologies[ranTechnology].maxThroughput;
                        const achievableThroughput = maxThroughput * ranTechnologies[ranTechnology].achievableThroughput[signalStrength];
                        const requiredDataRate = serviceTypes[serviceType].requiredDataRate;

                        // Check if achievable data rate is sufficient
                        if (achievableThroughput < requiredDataRate) {
                            // Display error message
                            sessionResult.innerHTML = `
                              <div class="error-message-2">
                                <p style="color: red;">Error: No session can be displayed.</p>
                                <p style="color: red;">Reason: The achievable data rate (${achievableThroughput} Mbit/s) is lower than the required data rate (${requiredDataRate} Mbit/s).</p>
                              </div>
                            `;
                            document.getElementById('session-result').classList.remove('hidden');
                            return;
                        }

                        // Calculate used data volume and charges
                        const usedDataVolume = ((achievableThroughput * duration * 60) / 8).toFixed(2); // Convert Mbit/s to MB
                        const subscription = subscriptions[subscriber.subscriptionType];
                        const totalCharges = (usedDataVolume > subscription.dataVolume ? (usedDataVolume - subscription.dataVolume) * 0.01 : 0).toFixed(2); // €0.01 per MB over limit

                        subscriber.totalDataUsed += parseFloat(usedDataVolume);
                        subscriber.totalCharges += parseFloat(totalCharges);

                        saveSubscribers(); // Update localStorage
                        sortSubscribers(); // Refresh the table

                        // Display session details
                        document.getElementById('session-subscriber-name').textContent = `${subscriber.forename} ${subscriber.surname}`;
                        document.getElementById('session-service-type').textContent = serviceType;
                        document.getElementById('session-duration-display').textContent = `${duration} minutes`;
                        document.getElementById('ran-technology').textContent = ranTechnology;
                        document.getElementById('data-signal-strength').textContent = signalStrength;
                        document.getElementById('data-rate').textContent = `${achievableThroughput.toFixed(2)} Mbit/s`;
                        document.getElementById('data-volume').textContent = `${usedDataVolume} MB`;
                        document.getElementById('data-total-charges').textContent = `€${totalCharges}`;

                        // Show data session details and hide voice call details
                        document.getElementById('data-session-details').classList.remove('hidden');
                        document.getElementById('voice-call-details').classList.add('hidden');
                        document.getElementById('session-result').classList.remove('hidden');
                    }
                }
                else if(formId === "invoice-form") {
                    const invoiceForm = document.getElementById('invoice-form');
                    const invoiceResult = document.getElementById('invoice-result');
                    const subscriberIndex = document.getElementById('invoice-subscriber-select').value;
                    const subscriber = subscribers[subscriberIndex];

                    // Display invoice details
                    document.getElementById('invoice-subscriber-name').textContent = `${subscriber.forename} ${subscriber.surname}`;
                    document.getElementById('invoice-data-used').textContent = `${subscriber.totalDataUsed} MB`;
                    document.getElementById('invoice-total-charges').textContent = `€${subscriber.totalCharges.toFixed(2)}`;

                    // Reset subscriber data
                    subscriber.totalDataUsed = 0;
                    subscriber.totalCharges = 0;
                    saveSubscribers(); // Update localStorage
                    sortSubscribers(); // Refresh the table

                    document.getElementById('invoice-result').classList.remove('hidden');

                    resetForm('invoice-form', 'invoice-submit-button', 'Create New Invoice');
                }
            }
        });
    }
});

function sortSubscribers() {
    subscribers.sort((a, b) => a.surname.localeCompare(b.surname));
    updateSubscriberTable();
}

function updateSubscriberTable() {
    subscriberTable.innerHTML = ''; // Clear the table
    subscribers.forEach((subscriber, index) => {
        const newRow = subscriberTable.insertRow();
        newRow.innerHTML = `
          <td>${subscriber.surname}</td>
          <td>${subscriber.forename}</td>
          <td>${subscriber.imsi}</td>
          <td>${subscriber.terminalType}</td>
          <td>${subscriber.subscriptionType}</td>
          <td>${subscriber.totalDataUsed} MB</td>
          <td>€${subscriber.totalCharges.toFixed(2)}</td>
          <td><button onclick="deleteSubscriber(${index})">Delete</button></td>
        `;
    });
}

// Delete Subscriber
function deleteSubscriber(index) {
    if (confirm("Are you sure you want to delete this subscriber?")) {
        subscribers.splice(index, 1); // Remove the subscriber
        saveSubscribers(); // Update localStorage
        sortSubscribers(); // Refresh the table
        updateSubscriberDropdowns(); // Refresh dropdowns
    }
}

// Update Subscriber Dropdowns
function updateSubscriberDropdowns() {
    const subscriberSelect = document.getElementById('subscriber-select');
    const invoiceSubscriberSelect = document.getElementById('invoice-subscriber-select');

    // Clear dropdowns
    subscriberSelect.innerHTML = '';
    invoiceSubscriberSelect.innerHTML = '';

    // Add options for each subscriber
    subscribers.forEach((subscriber, index) => {
        const option = document.createElement('option');
        option.value = index; // Use index as value
        option.textContent = `${subscriber.forename} ${subscriber.surname}`;
        subscriberSelect.appendChild(option.cloneNode(true));
        invoiceSubscriberSelect.appendChild(option.cloneNode(true));
    });
}

updateSubscriberDropdowns();
sortSubscribers();

// Real-time error removal when typing in fields
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", function () {
        let errorSpan = this.nextElementSibling;
        this.classList.remove("error-border");
        if (errorSpan && errorSpan.classList.contains("error-message")) {
            errorSpan.classList.remove("show-error");
        }
    });
});
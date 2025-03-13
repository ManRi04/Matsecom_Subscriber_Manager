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

                    // Add subscriber to the table
                    const newRow = subscriberTable.insertRow();
                    newRow.innerHTML = `
                        <td>${surname}</td>
                        <td>${forename}</td>
                        <td>${imsi}</td>
                        <td>${terminalType}</td>
                        <td>${subscriptionType}</td>
                        <td><button onclick="deleteSubscriber(this)">Delete</button></td>
                      `;

                    const user = {
                        forename:"Manuel",
                        surname:"Riess",
                        imsi: "test",
                        terminalType: "test",
                        subscriptionType:"type",

                    };

                    fetch("http://localhost:8080/api/user", {
                        method: 'POST', // POST-Methode
                        headers: {
                            'Content-Type': 'application/json' // Der Server erwartet JSON-Daten
                        },
                        body: JSON.stringify(user) // Die Daten in JSON umwandeln
                    })
                        .then(response => {
                            // Überprüfen, ob der Content-Type der Antwort JSON ist
                            const contentType = response.headers.get("Content-Type");

                            if (contentType && contentType.includes("application/json")) {
                                return response.json(); // Wenn JSON erwartet wird, die Antwort als JSON behandeln
                            } else {
                                return response.text(); // Andernfalls als Text behandeln
                            }
                        })
                        .then(responseData => {
                            console.log("Antwort vom Server:", responseData);
                            // Falls es JSON war, kann man hier mit der Antwort weiterarbeiten
                            // Beispiel: const jsonResponse = responseData; // Wenn es JSON war
                        })
                        .catch(error => {
                            console.error("Fehler:", error); // Fehlerbehandlung
                        });


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

                    const subscriber = document.getElementById('subscriber-select').value;
                    const serviceType = document.getElementById('service-type').value;
                    const duration = parseInt(document.getElementById('session-duration').value);

                    // Get subscriber details (example data, replace with actual data from backend)
                    const subscriberDetails = {
                        name: "Elias Plum",
                        terminal: "Samsung s42plus", // Example terminal
                        subscription: "GreenMobil M" // Example subscription
                    };

                    // Get terminal and subscription details
                    const terminal = subscriberDetails.terminal;
                    const subscription = subscriptions[subscriberDetails.subscription];

                    // Get service type details
                    const service = serviceTypes[serviceType];

                    // Simulate session
                    if (serviceType === "Voice call") {
                        simulateVoiceCall(subscriberDetails, duration, subscription);
                    } else {
                        simulateDataSession(subscriberDetails, duration, service, terminal, subscription);
                    }

                    // Simulate Voice Call
                    function simulateVoiceCall(subscriber, duration, subscription) {
                        const freeMinutes = subscription.freeMinutes;
                        const extraMinutes = Math.max(0, duration - freeMinutes);
                        const totalCharges = (extraMinutes * subscription.pricePerExtraMinute).toFixed(2);

                        // Display session details
                        document.getElementById('session-subscriber-name').textContent = subscriber.name;
                        document.getElementById('session-service-type').textContent = "Voice Call";
                        document.getElementById('session-duration-display').textContent = `${duration} minutes`;
                        document.getElementById('voice-total-charges').textContent = `€${totalCharges}`;

                        // Show voice call details and hide data session details
                        document.getElementById('voice-call-details').classList.remove('hidden');
                        document.getElementById('data-session-details').classList.add('hidden');
                        document.getElementById('session-result').classList.remove('hidden');
                    }

                    // Simulate Data Session
                    function simulateDataSession(subscriber, duration, service, terminal, subscription) {
                        const signalStrength = ["good", "medium", "low", "na"][Math.floor(Math.random() * 4)];
                        const availableRANTechnologies = terminals[terminal].filter(tech => service.ranTechnologies.includes(tech));
                        let ranTechnology;
                        if(serviceType === "Adaptive HD video" && terminal === "Samsung s42plus") {
                            ranTechnology = "4G"
                        }
                        else {
                            ranTechnology = availableRANTechnologies[Math.floor(Math.random() * availableRANTechnologies.length)];
                        }
                        const maxThroughput = ranTechnologies[ranTechnology].maxThroughput;
                        const achievableThroughput = maxThroughput * ranTechnologies[ranTechnology].achievableThroughput[signalStrength];
                        const requiredDataRate = service.requiredDataRate;

                        // Check if achievable data rate is sufficient
                        if (achievableThroughput < requiredDataRate) {
                            // Display error message
                            sessionResult.innerHTML = `
                              <div class="error-message-2">
                                <p style="color: red;">Error: No session can be displayed.</p>
                                <p style="color: red;">Reason: The achievable data rate (${achievableThroughput.toFixed(2)} Mbit/s) is lower than the required data rate (${requiredDataRate} Mbit/s).</p>
                              </div>
                            `;
                            document.getElementById('session-result').classList.remove('hidden');
                            return;
                        }

                        // Calculate used data volume and charges
                        const usedDataVolume = ((achievableThroughput * duration * 60) / 8).toFixed(2); // Convert Mbit/s to MB
                        const totalCharges = (usedDataVolume > subscription.dataVolume ? (usedDataVolume - subscription.dataVolume) * 0.01 : 0).toFixed(2); // €0.01 per MB over limit

                        // Display session details
                        document.getElementById('session-subscriber-name').textContent = subscriber.name;
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
                    const subscriber = document.getElementById('invoice-subscriber-select').value;

                    // Display invoice result
                    invoiceResult.innerHTML = `
                        <p>Invoice generated for ${subscriber}.</p>
                      `;
                }
            }
        });
    }
});

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

function deleteSubscriber(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}
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

                    const data = {
                        benutzername: "janedoe",
                        email: "janedoe@example.com",

                    };

                    fetch("http://localhost:8080/api/user", {
                        method: 'POST', // POST-Methode
                        headers: {
                            'Content-Type': 'application/json' // Der Server erwartet JSON-Daten
                        },
                        body: JSON.stringify(data) // Die Daten in JSON umwandeln
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
                    const subscriber = document.getElementById('subscriber-select').value;
                    const serviceType = document.getElementById('service-type').value;
                    const duration = document.getElementById('session-duration').value;

                    // Display session result
                    sessionResult.innerHTML = `
                        <p>Session simulated for ${subscriber}.</p>
                        <p>Service Type: ${serviceType}</p>
                        <p>Duration: ${duration} minutes</p>
                      `;
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
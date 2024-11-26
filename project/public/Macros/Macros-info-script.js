/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */

async function fetchAndDisplayMacros() {
    const tableElement = document.getElementById('macros');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/macros', {
        method: 'GET'
    });

    const responseData = await response.json();
    const macrosContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    macrosContent.forEach(macro => {
        const row = tableBody.insertRow();
        macro.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function insertMacros(event) {
    event.preventDefault();
    const macroId = document.getElementById("insertMacroId").value;
    const fiber = document.getElementById("insertFiber").value;
    const sugar = document.getElementById("insertSugar").value;
    const fat = document.getElementById("insertFat").value;
    const carbohydrates = document.getElementById("insertCarbohydrates").value;
    const protein = document.getElementById("insertProtein").value;
    const calories = document.getElementById("insertCalories").value;

    const response = await fetch('/insert-macros', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            macro_id: macroId,
            fiber: fiber,
            sugar: sugar,
            fat: fat,
            carbohydrates: carbohydrates,
            protein: protein,
            calories: calories
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertMacrosResultMsg');

    if (responseData.success) {
        console.log("success!");
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        console.log(responseData);
        messageElement.textContent = "Error inserting data!";
    }
}

async function updateMacros(event) {
    event.preventDefault();
    const macroId = document.getElementById("updateMacroId").value;
    const fiber = document.getElementById("updateFiber").value;
    const sugar = document.getElementById("updateSugar").value;
    const fat = document.getElementById("updateFat").value;
    const carbohydrates = document.getElementById("updateCarbohydrates").value;
    const protein = document.getElementById("updateProtein").value;
    const calories = document.getElementById("updateCalories").value;

    const response = await fetch('/update-macros', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            macro_id: macroId,
            fiber: fiber,
            sugar: sugar,
            fat: fat,
            carbohydrates: carbohydrates,
            protein: protein,
            calories: calories
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateMacrosResultMsg');

    if (responseData.success) {
        messageElement.textContent = `Macros updated successfully!`;
        fetchTableData();
    } else {
        messageElement.textContent = `Error updating Macros`;
    }
}

async function deleteMacros(event) {
    event.preventDefault();
    const macroId = document.getElementById("deleteMacroId").value;

    const confirmation = confirm(`Are you sure you want to delete macro with ID: ${macroId}?`);
    if (!confirmation) return;

    const response = await fetch('/delete-from-macros', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            macro_id: macroId
        })
    });

    const responseData = await response.json();

    const messageElement = document.getElementById('deleteMacrosResultMsg');

    if (responseData.success) {
        messageElement.textContent = `removed macro number ${macroId} from Macros successfully!`;
        fetchTableData();
    } else {
        messageElement.textContent = `macro number ${macroId} not found!`;
    }
}

async function countMacros() {
    const response = await fetch("/count-macros", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countMacrosResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in macros: ${tupleCount}`;
    } else {
        alert("Error in count macros!");
    }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    fetchTableData();
    document.getElementById("insertMacros").addEventListener("submit", insertMacros);
    document.getElementById("updateMacros").addEventListener("submit", updateMacros);
    document.getElementById("deleteMacros").addEventListener("submit", deleteMacros);
    document.getElementById("countMacros").addEventListener("click", countMacros);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayMacros();
}

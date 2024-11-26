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

// Fetches data from the userinfo and displays it.
async function fetchAndDisplayMacros() {
    const tableElement = document.getElementById('macros');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/macros', {
        method: 'GET'
    });

    const responseData = await response.json();
    const macrosContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
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

// Inserts new records into the userinfo.
async function insertMacro(event) {
    event.preventDefault();

    const macroId = document.getElementById("insertMacroId").value;
    const fiber = document.getElementById("insertFiber").value;
    const sugar = document.getElementById("insertSugar").value;
    const fat = document.getElementById("insertFat").value;
    const carbohydrates = document.getElementById("insertCarbohydrates").value;
    const protein = document.getElementById("insertProtein").value;
    const calories = document.getElementById("insertCalories").value;

    const response = await fetch('/insert-macro', {
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
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        console.log("success!");
        messageElement.textContent = "Macro inserted successfully!";
        fetchTableData();
    } else {
        console.log(responseData);
        messageElement.textContent = "Error inserting macro!";
    }
}

// Updates names in the userinfo.
async function updateMacro(event) {
    event.preventDefault();

    const macroId = document.getElementById("updateMacroId").value;
    const fiber = document.getElementById("updateFiber").value;
    const sugar = document.getElementById("updateSugar").value;
    const fat = document.getElementById("updateFat").value;
    const carbohydrates = document.getElementById("updateCarbohydrates").value;
    const protein = document.getElementById("updateProtein").value;
    const calories = document.getElementById("updateCalories").value;

    const response = await fetch('/update-macro', {
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
    const messageElement = document.getElementById('updateMacroResultMsg');

    if (responseData.success) {
        messageElement.textContent = `Macro updated successfully!`;
        fetchTableData();
    } else {
        messageElement.textContent = `Error updating macro`;
    }
}

// Deletes given row in the userinfo.
async function deleteMacro(event) {
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

    const messageElement = document.getElementById('deleteMacroResultMsg');

    if (responseData.success) {
        messageElement.textContent = `Removed macro number ${macroId} successfully!`;
        fetchTableData();
    } else {
        messageElement.textContent = `Macro number ${macroId} not found!`;
    }
}

// Counts rows in the userinfo.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countMacros() {
    const response = await fetch("/count-macros", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

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
    document.getElementById("insertMacro").addEventListener("submit", insertMacro);
    document.getElementById("updateMacro").addEventListener("submit", updateMacro);
    document.getElementById("deleteMacro").addEventListener("submit", deleteMacro);
    document.getElementById("countMacros").addEventListener("click", countMacros);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayMacros();
}

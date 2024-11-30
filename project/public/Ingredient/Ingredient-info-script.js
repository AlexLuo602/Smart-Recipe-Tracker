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
async function fetchAndDisplayIngredients() {
    const tableElement = document.getElementById('ingredientTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/ingredient', {
        method: 'GET'
    });

    const responseData = await response.json();
    const ingredientContent = responseData.data;

    // Always clear old data before fetching new data
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    ingredientContent.forEach(ingredient => {
        const row = tableBody.insertRow();
        ingredient.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Inserts new records into the userinfo.
async function insertIngredient(event) {
    event.preventDefault();

    const name = document.getElementById('insertName').value;
    const brand = document.getElementById('insertBrand').value;
    const taste = document.getElementById('insertTaste').value;
    const foodType = document.getElementById('insertFoodType').value;
    const macroId = document.getElementById('insertMacroId').value;

    const response = await fetch('/insert-ingredient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            brand: brand,
            taste: taste,
            food_type: foodType,
            macro_id: macroId
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = 'Ingredient inserted successfully!';
        fetchTableData();
    } else {
        messageElement.textContent = 'Error inserting ingredient!';
    }
}

// Updates names in the userinfo.
async function updateIngredient(event) {
    event.preventDefault();

    const name = document.getElementById('updateName').value;
    const brand = document.getElementById('updateBrand').value;
    const taste = document.getElementById('updateTaste').value;
    const foodType = document.getElementById('updateFoodType').value;
    const macroId = document.getElementById('updateMacroId').value;

    const body = {
        name: name,
        brand: brand,
        taste: taste,
        food_type: foodType,
        macro_id: macroId
    };

    const response = await fetch('/update-ingredient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateIngredientResultMsg');

    if (responseData.success) {
        messageElement.textContent = 'Ingredient updated successfully!';
        fetchTableData();
    } else {
        messageElement.textContent = 'Error updating ingredient!';
    }
}

// Deletes given row in the ingredients.
async function deleteIngredient(event) {
    event.preventDefault();

    const name = document.getElementById('deleteName').value;
    const brand = document.getElementById('deleteBrand').value;

    const confirmation = confirm(`Are you sure you want to delete ingredient: ${name} (${brand})?`);
    if (!confirmation) return;

    const response = await fetch('/delete-from-ingredient', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            brand: brand
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteIngredientResultMsg');

    if (responseData.success) {
        messageElement.textContent = `Removed ingredient ${name} (${brand}) successfully!`;
        fetchTableData();
    } else {
        messageElement.textContent = `Ingredient ${name} (${brand}) not found!`;
    }
}

// Counts rows in the userinfo.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countIngredients() {
    const response = await fetch('/count-ingredient', {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in Ingredient: ${tupleCount}`;
    } else {
        alert('Error counting ingredients!');
    }
}

async function searchIngredients(event) {
    event.preventDefault();
    const conditionString = document.getElementById("searchConditions").value;
    console.log('Attempting to search with:', conditionString);

    const response = await fetch('/search-ingredients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ conditionString })
    });

    const responseData = await response.json();
    if (responseData.error) {
        console.log('Search error:', responseData.error);
        alert(responseData.error);
    } else {
        console.log('Search results:', responseData.data);
        displaySearchResults(responseData.data);
    }
}

function displaySearchResults(records) {
    const resultsDiv = document.getElementById('searchResults');
    if (records.length === 0) {
        resultsDiv.textContent = "No records found.";
        return;
    }

    let html = '<table border="1"><thead><tr><th>Recipe ID</th><th>Name</th></tr></thead><tbody>';
    records.forEach(record => {
        html += `<tr><td>${record[0]}</td><td>${record[1]}</td></tr>`;
    });
    html += '</tbody></table>';
    resultsDiv.innerHTML = html;
}

async function viewSpecificFields(event) {
    event.preventDefault();
    const selectedFields = Array.from(document.querySelectorAll('input[name="fields"]:checked'))
        .map(checkbox => checkbox.value);

    if (selectedFields.length === 0) {
        alert("Please select at least one field.");
        return;
    }

    // Fetch data from the server
    const response = await fetch('/get-ingredient-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: selectedFields })
    });

    const responseData = await response.json();

    if (responseData.success) {
        populateTable(selectedFields, responseData.result);
    } else {
        // messageElement.textContent = 'Error inserting ingredient!';
    }
}

function populateTable(selected_fields, data) {
    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    // Create table header
    const headerRow = document.createElement("tr");
    for (const field of selected_fields) {
        const th = document.createElement("th");
        th.textContent = field;
        headerRow.appendChild(th);
    }
    tableHead.appendChild(headerRow);

    // Create table rows
    for (const row of data) {
        const tableRow = document.createElement("tr");
        for (const field of selected_fields) {
            const td = document.createElement("td");
            td.textContent = row[field] || ""; // Use field as key
            tableRow.appendChild(td);
        }
        tableBody.appendChild(tableRow);
    }

    const ingredientTable =  document.getElementById("selectedIngredientTable");
    ingredientTable.style.display = "table";
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    fetchTableData();
    document.getElementById('insertIngredientForm').addEventListener('submit', insertIngredient);
    document.getElementById('updateIngredientForm').addEventListener('submit', updateIngredient);
    document.getElementById('deleteIngredientForm').addEventListener('submit', deleteIngredient);
    document.getElementById('countIngredient').addEventListener('click', countIngredients);
    document.getElementById("searchIngredientsForm").addEventListener("submit", searchIngredients);
    document.getElementById("viewFieldsButton").addEventListener("click", viewSpecificFields);
    document.getElementById("selectAll").addEventListener("change", function () {
        const checkboxes = document.querySelectorAll('input[name="fields"]');
        checkboxes.forEach(checkbox => checkbox.checked = this.checked);
    });
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayIngredients();
}

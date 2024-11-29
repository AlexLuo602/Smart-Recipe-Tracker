async function fetchAndDisplayRecipeRecords() {
    console.log('hello')
    const tableElement = document.getElementById('recipes');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/recipes', {
        method: 'GET'
    });

    const responseData = await response.json();
    const mealRecordsContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    mealRecordsContent.forEach(mealRecord => {
        const row = tableBody.insertRow();
        mealRecord.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function insertMealRecord(event) {
    event.preventDefault();
    const recipeId = document.getElementById("insertRecipeId").value;
    const name = document.getElementById("insertName").value;

    const response = await fetch('/insert-recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recipe_id: recipeId,
            name: name
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Meal record inserted successfully!";
        fetchMealRecordData();
    } else {
        messageElement.textContent = "Error inserting meal record!";
    }
}


async function searchRecipes(event) {
    event.preventDefault();
    const conditionString = document.getElementById("searchConditions").value;
    console.log('Attempting to search with:', conditionString);

    const response = await fetch('/search-recipes', {
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

document.addEventListener('DOMContentLoaded', function() {
    fetchMealRecordData();
    document.getElementById("insertrecipe").addEventListener("submit", insertMealRecord);
    document.getElementById("searchRecipesForm").addEventListener("submit", searchRecipes);
});

function fetchMealRecordData() {

    fetchAndDisplayRecipeRecords();
}

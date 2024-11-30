async function fetchAndDisplayRecipeRecords() {
    console.log('hello')
    const tableElement = document.getElementById('recipes');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/recipes', {
        method: 'GET'
    });

    const responseData = await response.json();
    const recipeRecordsContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    recipeRecordsContent.forEach(recipeRecord => {
        const row = tableBody.insertRow();
        recipeRecord.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchAndDisplayStepRecords(recipeId) {
    console.log('hello')
    const errorMessage = document.getElementById('errorMessage');
    const stepsTable = document.getElementById('stepsTable');
    const tableBody = stepsTable.querySelector('tbody');

    tableBody.innerHTML = '';
    stepsTable.style.display = 'none';


    const response = await fetch(`/select-recipes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recipe_id: recipeId,
        })
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.data.length === 0) {
        errorMessage.textContent = 'No steps found for this recipe.';
        errorMessage.style.display = 'block';
        return;
    }

    recipeName.textContent = data.data[0].RECIPE_NAME;
    recipeName.style.display = 'block';
    data.data.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.STEP_NUMBER}</td>
            <td>${record.DESCRIPTION}</td>
        `;
        tableBody.appendChild(row);
    });

    // Display the table
    stepsTable.style.display = 'table';
}

async function insertRecipeRecord(event) {
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
        fetchRecipeData();
    } else {
        messageElement.textContent = "Error inserting meal record!";
    }
}

async function deleteRecipe(event) {
    event.preventDefault();
    const recipeId = document.getElementById("deleteId").value;

    const confirmation = confirm(`Are you sure you want to delete recipe with ID: ${recipeId}?`);
    if (!confirmation) return;

    const response = await fetch('/delete-from-recipe', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recipe_id: recipeId
        })
    });

    const responseData = await response.json();

    const messageElement = document.getElementById('deleteRecipeInfoResultMsg');

    if (responseData.success) {
        messageElement.textContent = `removed recipe number ${recipeId} from Recipe successfully!`;
        fetchRecipeData();
        fetchAndDisplayStepRecords(recipeId);
    } else {
        messageElement.textContent = `recipe number ${recipeId} not found!`;
    }
}

async function deleteStep(event) {
    event.preventDefault();
    const recipeId = document.getElementById("deleteRecipeId").value;
    const stepNumber = document.getElementById("deleteStepNumber").value;

    const confirmation = confirm(`Are you sure you want to delete step number: ${stepNumber}?`);
    if (!confirmation) return;

    const response = await fetch('/delete-from-step', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            step_number: stepNumber,
            recipe_id: recipeId
        })
    });

    const responseData = await response.json();

    const messageElement = document.getElementById('deleteStepInfoResultMsg');

    if (responseData.success) {
        messageElement.textContent = `removed step number ${stepNumber} from Step successfully!`;
        try {
            await fetchAndDisplayStepRecords(recipeId);
        } catch (error) {
            messageElement.textContent = error.message;
            messageElement.style.display = 'block';
        }
    } else {
        messageElement.textContent = `step number ${stepNumber} not found!`;
    }
}

async function getStepsForRecipe() {
    const recipeId = document.getElementById('recipeId').value;
    const errorMessage = document.getElementById('errorMessage');
    const recipeName = document.getElementById('recipeName');

    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
    recipeName.style.display = 'none';
    recipeName.textContent = '';

    if (!recipeId || isNaN(recipeId)) {
        errorMessage.textContent = 'Please enter a valid Recipe ID.';
        errorMessage.style.display = 'block';
        return;
    }

    try {
        await fetchAndDisplayStepRecords(recipeId);
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
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

window.onload = function() {
    fetchRecipeData();
    document.getElementById("insertrecipe").addEventListener("submit", insertRecipeRecord);
    document.getElementById('fetchSteps').addEventListener("click", getStepsForRecipe);
    document.getElementById("deleteRecipe").addEventListener("submit", deleteRecipe);
    document.getElementById("deleteStep").addEventListener("submit", deleteStep);
    document.getElementById("searchRecipesForm").addEventListener("submit", searchRecipes);
};

function fetchRecipeData() {
    fetchAndDisplayRecipeRecords();
}

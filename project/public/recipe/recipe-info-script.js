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
        fetchMealRecordData();
    } else {
        messageElement.textContent = "Error inserting meal record!";
    }
}

async function getStepsForRecipe() {
    const recipeId = document.getElementById('recipeId').value;
    const errorMessage = document.getElementById('errorMessage');
    const recipeName = document.getElementById('recipeName');
    const stepsTable = document.getElementById('stepsTable');
    const tableBody = stepsTable.querySelector('tbody');

    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
    recipeName.style.display = 'none';
    recipeName.textContent = '';
    tableBody.innerHTML = '';
    stepsTable.style.display = 'none';

    if (!recipeId || isNaN(recipeId)) {
        errorMessage.textContent = 'Please enter a valid Recipe ID.';
        errorMessage.style.display = 'block';
        return;
    }

    try {
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
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
}

window.onload = function() {
    fetchMealRecordData();
    document.getElementById("insertrecipe").addEventListener("submit", insertRecipeRecord);
    document.getElementById('fetchSteps').addEventListener("click", getStepsForRecipe);
};

function fetchMealRecordData() {
    fetchAndDisplayRecipeRecords();
}

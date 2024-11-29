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

window.onload = function() {
    fetchMealRecordData();
    document.getElementById("insertrecipe").addEventListener("submit", insertMealRecord);
};

function fetchMealRecordData() {
    fetchAndDisplayRecipeRecords();
}

async function fetchAndDisplayMealRecords() {
    const tableElement = document.getElementById('mealRecords');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/meal-records', {
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

    const mealRecordId = document.getElementById("insertMealRecordId").value;
    const mealRecordDate = document.getElementById("insertMealRecordDate").value;
    const userId = document.getElementById("insertUserId").value;
    const recipeId = document.getElementById("insertRecipeId").value;

    const response = await fetch('/insert-meal-record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            meal_record_id: mealRecordId,
            meal_record_date: mealRecordDate,
            user_id: userId,
            recipe_id: recipeId
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

async function updateMealRecord(event) {
    event.preventDefault();

    const mealRecordId = document.getElementById("updateMealRecordId").value;
    const mealRecordDate = document.getElementById("updateMealRecordDate").value;
    const userId = document.getElementById("updateUserId").value;
    const recipeId = document.getElementById("updateRecipeId").value;

    const ToUpdate = {};
    if (mealRecordDate) ToUpdate["meal_record_date"] = mealRecordDate;
    if (userId) ToUpdate["user_id"] = userId;
    if (recipeId) ToUpdate["recipe_id"] = recipeId;

    const response = await fetch('/update-meal-record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            meal_record_id: mealRecordId,
            ...ToUpdate
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateMealRecordResultMsg');

    if (responseData.success) {
        messageElement.textContent = `Meal record updated successfully!`;
        fetchMealRecordData();
    } else {
        messageElement.textContent = `Error updating meal record`;
    }
}

async function deleteMealRecord(event) {
    event.preventDefault();
    const mealRecordId = document.getElementById("deleteMealRecordId").value;

    const confirmation = confirm(`Are you sure you want to delete meal record with ID: ${mealRecordId}?`);
    if (!confirmation) return;

    const response = await fetch('/delete-meal-record', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            meal_record_id: mealRecordId
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteMealRecordResultMsg');

    if (responseData.success) {
        messageElement.textContent = `Removed meal record number ${mealRecordId} successfully!`;
        fetchMealRecordData();
    } else {
        messageElement.textContent = `Meal record number ${mealRecordId} not found!`;
    }
}

async function countMealRecords() {
    const response = await fetch("/count-meal-records", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in MealRecord: ${tupleCount}`;
    } else {
        alert("Error in counting meal records!");
    }
}

window.onload = function() {
    fetchMealRecordData();
    document.getElementById("insertMealRecord").addEventListener("submit", insertMealRecord);
    document.getElementById("updateMealRecord").addEventListener("submit", updateMealRecord);
    document.getElementById("deleteMealRecord").addEventListener("submit", deleteMealRecord);
    document.getElementById("countMealRecords").addEventListener("click", countMealRecords);
};

function fetchMealRecordData() {
    fetchAndDisplayMealRecords();
}

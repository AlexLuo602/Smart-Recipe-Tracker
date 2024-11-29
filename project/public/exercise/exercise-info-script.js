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


async function fetchAndDisplayExerciseRecord() {
    console.log("asdf")
    const tableElement = document.getElementById('exercises');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/exercises', {
        method: 'GET'
    });

    const responseData = await response.json();
    const exerciseContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    exerciseContent.forEach(exercise => {
        const row = tableBody.insertRow();
        exercise.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function insertExerciseRecord(event) {
    event.preventDefault();

    const exerciseRecordId = document.getElementById("insertExerciseRecordId").value;
    const recordDate = document.getElementById("insertDate").value;
    const caloriesBurnt = document.getElementById("insertCalories").value;
    const exerciseType = document.getElementById("insertType").value;
    const userId = document.getElementById("insertUserId").value;

    const response = await fetch('/insert-exercise-record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            excercise_record_id: exerciseRecordId,
            exercise_record_date: recordDate,
            calories_burned: caloriesBurnt,
            type: exerciseType,
            user_id: userId,
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        console.log("success!");
        messageElement.textContent = "Goal inserted successfully!";
        fetchTableData();
    } else {
        console.log(responseData);
        messageElement.textContent = "Error inserting goal!";
    }
}

async function updateExerciseRecord(event) {
    event.preventDefault();

    const exerciseRecordId = document.getElementById("updateExerciseRecordId").value;
    const recordDate = document.getElementById("updateDate").value;
    const caloriesBurnt = document.getElementById("updateCalories").value;
    const exerciseType = document.getElementById("updateType").value;
    const userId = document.getElementById("updateUserId").value;

    const response = await fetch('/update-exercise-record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            excercise_record_id: exerciseRecordId,
            exercise_record_date: recordDate,
            calories_burned: caloriesBurnt,
            type: exerciseType,
            user_id: userId,
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateExerciseRecordResultMsg');

    if (responseData.success) {
        messageElement.textContent = `Exercise updated successfully!`;
        fetchTableData();
    } else {
        messageElement.textContent = `Error updating Exercise`;
    }
}

async function deleteExerciseRecord(event) {
    event.preventDefault();
    const exerciseRecordId = document.getElementById("deleteExerciseRecordId").value;

    const confirmation = confirm(`Are you sure you want to delete goal with ID: ${exerciseRecordId}?`);
    if (!confirmation) return;

    const response = await fetch('/delete-from-exercise-record', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            excercise_record_id: exerciseRecordId
        })
    });

    const responseData = await response.json();

    const messageElement = document.getElementById('deleteExerciseRecordResultMsg');

    if (responseData.success) {
        messageElement.textContent = `Removed exercise record number ${goalId} successfully!`;
        fetchTableData();
    } else {
        messageElement.textContent = `Exercise record number ${goalId} not found!`;
    }
}

async function fetchAndDisplayAverageCaloriesBurned() {
    const tableElement = document.getElementById('caloriesTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/averageBurntCalories', {
        method: 'GET'
    });

    const responseData = await response.json();
    const exerciseContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    console.log("the jewels: ")
    console.log(exerciseContent)

    exerciseContent.forEach(exercise => {
        const row = tableBody.insertRow();
        exercise.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
    tableElement.style.display = "table";
}


async function fetchAndDisplayHighCalorieExercises() {
    const tableElement = document.getElementById('highCalorieExercisesTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/highCalorieExercises', {
        method: 'GET'
    });

    const responseData = await response.json();
    const exerciseContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    exerciseContent.forEach(exercise => {
        const row = tableBody.insertRow();
        const typeCell = row.insertCell(0);
        const caloriesCell = row.insertCell(1);
        typeCell.textContent = exercise[0];
        caloriesCell.textContent = exercise[1];
    });
    tableElement.style.display = "table";
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    fetchTableData();
    document.getElementById("insertExerciseRecord").addEventListener("submit", insertExerciseRecord);
    document.getElementById("updateExerciseRecord").addEventListener("submit", updateExerciseRecord);
    document.getElementById("deleteExerciseRecord").addEventListener("submit", deleteExerciseRecord);
    document.getElementById('fetchHighCalorieExercises').addEventListener('click', fetchAndDisplayHighCalorieExercises);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayExerciseRecord();
    fetchAndDisplayAverageCaloriesBurned();
}

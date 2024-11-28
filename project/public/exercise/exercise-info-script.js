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
async function fetchAndDisplayExerciseRecord() {
    const tableElement = document.getElementById('exercises');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/exercises', {
        method: 'GET'
    });

    const responseData = await response.json();
    const goalsContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    goalsContent.forEach(goal => {
        const row = tableBody.insertRow();
        goal.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Inserts new records into the userinfo.
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

// Updates names in the userinfo.
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

// Deletes given row in the userinfo.
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

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    fetchTableData();
    document.getElementById("insertExerciseRecord").addEventListener("submit", insertExerciseRecord);
    document.getElementById("updateExerciseRecord").addEventListener("submit", updateExerciseRecord);
    document.getElementById("deleteExerciseRecord").addEventListener("submit", deleteExerciseRecord);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayExerciseRecord();
}

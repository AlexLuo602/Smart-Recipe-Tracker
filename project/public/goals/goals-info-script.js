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
async function fetchAndDisplayGoals() {
    const tableElement = document.getElementById('goals');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/goals', {
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
async function insertGoal(event) {
    event.preventDefault();

    const goalId = document.getElementById("insertGoalId").value;
    const startDate = document.getElementById("insertStartDate").value;
    const endDate = document.getElementById("insertEndDate").value;
    const goalsType = document.getElementById("insertGoalsType").value;
    const valueDiff = document.getElementById("insertValueDiff").value;
    const userId = document.getElementById("insertUserId").value;
    const macroId = document.getElementById("insertMacroId").value;

    const response = await fetch('/insert-goal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            goal_id: goalId,
            start_date: startDate,
            end_date: endDate,
            goals_type: goalsType,
            value_diff: valueDiff,
            user_id: userId,
            macro_id: macroId
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
async function updateGoal(event) {
    event.preventDefault();

    const goalId = document.getElementById("updateGoalId").value;
    const startDate = document.getElementById("updateStartDate").value;
    const endDate = document.getElementById("updateEndDate").value;
    const goalsType = document.getElementById("updateGoalsType").value;
    const valueDiff = document.getElementById("updateValueDiff").value;
    const userId = document.getElementById("updateUserId").value;
    const macroId = document.getElementById("updateMacroId").value;

    const response = await fetch('/update-goal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            goal_id: goalId,
            start_date: startDate,
            end_date: endDate,
            goals_type: goalsType,
            value_diff: valueDiff,
            user_id: userId,
            macro_id: macroId
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateGoalResultMsg');

    if (responseData.success) {
        messageElement.textContent = `Goal updated successfully!`;
        fetchTableData();
    } else {
        messageElement.textContent = `Error updating goal`;
    }
}

// Deletes given row in the userinfo.
async function deleteGoal(event) {
    event.preventDefault();
    const goalId = document.getElementById("deleteGoalId").value;

    const confirmation = confirm(`Are you sure you want to delete goal with ID: ${goalId}?`);
    if (!confirmation) return;

    const response = await fetch('/delete-from-goals', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            goal_id: goalId
        })
    });

    const responseData = await response.json();

    const messageElement = document.getElementById('deleteGoalResultMsg');

    if (responseData.success) {
        messageElement.textContent = `Removed goal number ${goalId} successfully!`;
        fetchTableData();
    } else {
        messageElement.textContent = `Goal number ${goalId} not found!`;
    }
}

// Counts rows in the userinfo.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countGoals() {
    const response = await fetch("/count-goals", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in goals: ${tupleCount}`;
    } else {
        alert("Error in count goals!");
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    fetchTableData();
    document.getElementById("insertGoal").addEventListener("submit", insertGoal);
    document.getElementById("updateGoal").addEventListener("submit", updateGoal);
    document.getElementById("deleteGoal").addEventListener("submit", deleteGoal);
    document.getElementById("countGoals").addEventListener("click", countGoals);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayGoals();
}

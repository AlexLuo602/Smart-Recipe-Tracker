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
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('userinfo');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/userinfo', {
        method: 'GET'
    });

    const responseData = await response.json();
    const userinfoContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    userinfoContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function insertUserInfo(event) {
    event.preventDefault();
    console.log("HELLOKMLNDFKS")

    const userId = document.getElementById("insertId").value;
    const username = document.getElementById("insertName").value;
    const weight = document.getElementById("insertWeight").value;
    const height = document.getElementById("insertHeight").value;
    const gender = document.getElementById("insertGender").value;
    const age = document.getElementById("insertAge").value;
    const rci = document.getElementById("insertRCI").value;

    const response = await fetch('/insert-userinfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userId,
            username: username,
            weight: weight,
            height: height,
            gender: gender,
            age: age,
            recommended_calorie_intake: rci
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        console.log("success!");
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        console.log(responseData);
        messageElement.textContent = "Error inserting data!";
    }
}

async function updateUserInfo(event) {
    event.preventDefault();

    const userId = document.getElementById("updateId").value;
    const username = document.getElementById("updateName").value;
    const weight = document.getElementById("updateWeight").value;
    const height = document.getElementById("updateHeight").value;
    const gender = document.getElementById("updateGender").value;
    const age = document.getElementById("updateAge").value;
    const rci = document.getElementById("updateRCI").value;

    const response = await fetch('/update-userinfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userId,
            username: username,
            weight: weight,
            height: height,
            gender: gender,
            age: age,
            recommended_calorie_intake: rci
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateUserInfoResultMsg');

    if (responseData.success) {
        messageElement.textContent = `UserInfo updated successfully!`;
        fetchTableData();
    } else {
        messageElement.textContent = `Error updating UserInfo`;
    }
}

async function deleteUserInfo(event) {
    event.preventDefault();
    const userId = document.getElementById("deleteId").value;

    const confirmation = confirm(`Are you sure you want to delete user with ID: ${userId}?`);
    if (!confirmation) return;

    const response = await fetch('/delete-from-userinfo', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userId
        })
    });

    const responseData = await response.json();

    const messageElement = document.getElementById('deleteUserInfoResultMsg');

    if (responseData.success) {
        messageElement.textContent = `removed user number ${userId} from UserInfo successfully!`;
        fetchTableData();
    } else {
        messageElement.textContent = `user number ${userId} not found!`;
    }
}

async function countUserInfo() {
    const response = await fetch("/count-userinfo", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in userinfo: ${tupleCount}`;
    } else {
        alert("Error in count userinfo!");
    }
}

async function getUsersWithMoreThanThreeMeals() {
    const tableBody = document.getElementById('user-table-body');

    tableBody.innerHTML = '';

    try {
        const response = await fetch('/users-with-more-than-three-meals');
        const data = await response.json();
        console.log(data)
        if (response.ok && data.data && data.data.length > 0) {
            data.data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user[0]}</td>
                    <td>${user[1]}</td>
                    <td>${user[2]}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="3">No users found with more than three meals.</td>`;
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="3">An error occurred while fetching data.</td>`;
        tableBody.appendChild(row);
    }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    fetchTableData();
    document.getElementById("insertUserInfo").addEventListener("submit", insertUserInfo);
    document.getElementById("updateUserInfo").addEventListener("submit", updateUserInfo);
    document.getElementById("deleteUserInfo").addEventListener("submit", deleteUserInfo);
    document.getElementById("countUserInfo").addEventListener("click", countUserInfo);
    document.getElementById('loadMealRecords').addEventListener('click', getUsersWithMoreThanThreeMeals);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}

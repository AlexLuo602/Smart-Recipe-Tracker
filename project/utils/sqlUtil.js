const fs = require('fs');
const path = require('path');

function loadSQLFile() {
    const filePath = path.resolve(__dirname, "../scripts/InitializeTables.sql");

    if (fs.existsSync(filePath)) {
        const sqlFile = fs.readFileSync(filePath, 'utf8');
        return sqlFile;
    } else {
        console.error(`.sql file not found at ${filePath}`);
        return {};
    }
}

module.exports = loadSQLFile;
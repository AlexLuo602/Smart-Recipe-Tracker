
//for sanitizing
function sanitizeDropTable(query) {
    console.log("sanitizing!")
    var regex = /\bDROP\s+TABLE\b/i;
    if (regex.test(query)) {
        throw new Error("Query contains a DROP TABLE statement, which is not allowed.");
    }
}

module.exports = {
    sanitizeDropTable
};
// for sanitizing dangerous SQL queries
function sanitizeQuery(query) {
    console.log("Sanitizing query!");
    console.log(query);
    query = query.toUpperCase();
    console.log(query);

    // Define a list of dangerous SQL keywords and patterns
    const dangerousPatterns = [
        /\bDROP\s+TABLE\b/i,   
        /\bDROP\s+DATABASE\b/i, 
        /\bTRUNCATE\b/i,       
        /\bDELETE\b/i,        
        /\bUPDATE\b/i,       
        /\bINSERT\b/i,         
        /\bALTER\s+TABLE\b/i,   
        /\bCREATE\b/i,         
        /\bEXEC\b/i,          
        /--/i,                  // Comment markers like -- (used for SQL injection)
        /;/i                    // Semicolon (used to terminate and chain SQL queries)
    ];

    // Check if any of the dangerous patterns are found in the query
    for (let pattern of dangerousPatterns) {
        if (pattern.test(query)) {
            throw new Error("Query contains dangerous SQL keywords, which are not allowed.");
        }
    }
}

module.exports = {
    sanitizeQuery
};

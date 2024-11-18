const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

// prefetched valid user IDs, to make sure the user is valid before adding or deleting recipes
const validUserIds = [1, 2];

const recipes = {};

// API endpoint Example 
app.get('/api', (req, res) => {
    res.send({ message: 'Hello from the backend!' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const userId = req.body.userId;
    if (validUserIds.includes(userId)) {
        res.send({ userId, message: `User ID ${userId} logged in successfully!` });
    } else {
        res.status(400).send({ message: 'Invalid user ID' });
    }
});

// Add recipe endpoint
app.post('/api/user/:userId/addRecipe', (req, res) => {
    const userId = req.params.userId;
    const recipe = req.body.recipe;
    if (!userId || !recipe || !validUserIds.includes(parseInt(userId, 10))) { // check if request body is valid
        res.status(400).send({ message: 'Invalid user ID or recipe' });
    } else {
        res.send({ message: 'Recipe added successfully!' });
    }
});

// Delete recipe endpoint
app.delete('/api/:userId/deleteRecipe/:recipeId', (req, res) => {
    const userId = req.params.userId;
    const recipeId = parseInt(req.params.recipeId, 10);

    res.status(400).send({ message: 'Invalid user ID or recipe ID' });

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
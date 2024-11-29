const express = require('express');
const appController = require('./rest/app/appController');
const userController = require('./rest/user/userController');
const goalsController = require('./rest/goals/goalsController');
const mealsController = require('./rest/meals/mealsController');
const macrosController = require('./rest/Macros/MacrosController');
const recipeController = require('./rest/recipe/recipeController');
const exercisesController = require('./rest/exercise/exercisesController');
const ingredientController = require('./rest/Ingredient/IngredientController');

// Load environment variables from .env file
// Ensure your .env file has the required database credentials.
const loadEnvFile = require('./utils/envUtil');
const envVariables = loadEnvFile('./.env');

const app = express();
const PORT = envVariables.PORT || 65534;  // Adjust the PORT if needed (e.g., if you encounter a "port already occupied" error)

// Middleware setup
app.use(express.static('public'));  // Serve static files from the 'public' directory
app.use(express.json());             // Parse incoming JSON payloads

// If you prefer some other file as default page other than 'index.html',
//      you can adjust and use the bellow line of code to
//      route to send 'DEFAULT_FILE_NAME.html' as default for root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/home/home.html');
});

app.get('/user-info', (req, res) => {
    res.sendFile(__dirname + '/public/user/user-info.html');
});

app.get('/goals-info', (req, res) => {
    res.sendFile(__dirname + '/public/goals/goals-info.html');
});

app.get('/macros-info', (req, res) => {
    res.sendFile(__dirname + '/public/Macros/Macros-info.html');
});

app.get('/ingredient-info', (req, res) => {
    res.sendFile(__dirname + '/public/Ingredient/Ingredient-info.html');
});

app.get('/meals-info', (req, res) => {
    res.sendFile(__dirname + '/public/meals/meals-info.html');
});

app.get('/exercise-info', (req, res) => {
    res.sendFile(__dirname + '/public/exercise/exercise-info.html');
});

app.get('/recipe-info', (req, res) => {
    res.sendFile(__dirname + '/public/recipe/recipe-info.html');
});

// mount the routers
app.use('/', appController);
app.use('/', recipeController);
app.use('/', userController);
app.use('/', mealsController);
app.use('/', goalsController);
app.use('/', macrosController);
app.use('/', exercisesController);
app.use('/', ingredientController);

// ----------------------------------------------------------
// Starting the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});


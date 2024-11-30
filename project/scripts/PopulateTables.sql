DROP TABLE MealRecord;
DROP TABLE ExerciseRecord;
DROP TABLE Goals;
DROP TABLE Consumes;
DROP TABLE BodyBuilder;
DROP TABLE DiabeticPerson;
DROP TABLE Ingredient;
DROP TABLE Step;
DROP TABLE Recipe;
DROP TABLE Macros;
DROP TABLE UserInfo;

CREATE TABLE Macros (
    macro_id INT,              
    fiber INT,          
    sugar INT,
    fat INT,         
    carbohydrates INT,                  
    protein INT,
    calories INT,
    PRIMARY KEY(macro_id)
);
grant select on Macros to public;

CREATE TABLE Recipe (
    recipe_id INT,
    name VARCHAR(25) NOT NULL,
    PRIMARY KEY(recipe_id)
);
grant select on Recipe to public;

CREATE TABLE UserInfo (
   user_id INT,
   username VARCHAR(25) UNIQUE NOT NULL,
   weight DECIMAL(5,2),
   height DECIMAL(5,2),
   gender VARCHAR(15),
   age INT,
   recommended_calorie_intake INT,
   PRIMARY KEY (user_id)
);
grant select on UserInfo to public;

CREATE TABLE Ingredient (
    name VARCHAR(255),
    brand VARCHAR(50),
    taste VARCHAR(255),
    macro_id INT NOT NULL,
    food_type VARCHAR(50),
    PRIMARY KEY(name, brand),
    FOREIGN KEY(macro_id) REFERENCES Macros (macro_id),
    UNIQUE (macro_id)
);
grant select on Ingredient to public;

CREATE TABLE MealRecord (
    meal_record_id INT,
    meal_record_date DATE,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    PRIMARY KEY(meal_record_id),
    FOREIGN KEY (user_id) REFERENCES UserInfo(user_id),
    FOREIGN KEY (recipe_id) REFERENCES Recipe(recipe_id)
);
grant select on MealRecord to public;

CREATE TABLE Goals (
    goal_id INT,
    start_date DATE,
    end_date DATE,
    goals_type VARCHAR(100),
    value_diff DECIMAL(5,2),
    PRIMARY KEY(goal_id),
    user_id INT NOT NULL,
    macro_id INT NOT NULL,
    UNIQUE (macro_id),
    FOREIGN KEY(user_id) REFERENCES UserInfo (user_id),
    FOREIGN KEY(macro_id) REFERENCES Macros (macro_id)
);
grant select on Goals to public;

CREATE TABLE ExerciseRecord (
   excercise_record_id INT,
   exercise_record_date DATE,
   calories_burned INT,
   type VARCHAR(25),
   user_id INT NOT NULL,
   PRIMARY KEY(excercise_record_id),
   FOREIGN KEY (user_id) REFERENCES UserInfo (user_id)
);
grant select on ExerciseRecord to public;

CREATE TABLE Consumes (
    recipe_id INT,
    user_id INT,
    PRIMARY KEY(recipe_id, user_id),
    FOREIGN KEY(recipe_id) REFERENCES Recipe(recipe_id),
    FOREIGN KEY(user_id) REFERENCES UserInfo (user_id)
);
grant select on Consumes to public;

CREATE TABLE Step (
    step_number INT, 
    description VARCHAR(55),
    recipe_id INT,
    PRIMARY KEY(step_number, recipe_id),
    FOREIGN KEY(recipe_id) REFERENCES Recipe(recipe_id)
        ON DELETE CASCADE
);
grant select on Step to public;

CREATE TABLE BodyBuilder (
    body_builder_id INT,
    training_duration_months INT,
    training_intensity DECIMAL(5,2),
    PRIMARY KEY (body_builder_id),
    FOREIGN KEY (body_builder_id) REFERENCES UserInfo(user_id)
);
grant select on BodyBuilder to public;

CREATE TABLE DiabeticPerson (
    diabetic_person_id INT,
    insulin_level DECIMAL(5,2),
    recommended_sugar_intake INT,
    PRIMARY KEY (diabetic_person_id),
    FOREIGN KEY (diabetic_person_id) REFERENCES UserInfo (user_id)
);
grant select on DiabeticPerson to public;


INSERT INTO Macros (macro_id, fiber, sugar, fat, carbohydrates, protein, calories) 
VALUES (1, 5, 10, 8, 25, 12, 250);

INSERT INTO Macros (macro_id, fiber, sugar, fat, carbohydrates, protein, calories) 
VALUES (2, 3, 5, 10, 30, 15, 300);

INSERT INTO Macros (macro_id, fiber, sugar, fat, carbohydrates, protein, calories) 
VALUES (3, 4, 12, 7, 22, 11, 275);

INSERT INTO Macros (macro_id, fiber, sugar, fat, carbohydrates, protein, calories) 
VALUES (4, 6, 9, 9, 28, 13, 290);

INSERT INTO Macros (macro_id, fiber, sugar, fat, carbohydrates, protein, calories) 
VALUES (5, 2, 4, 5, 18, 8, 200);

INSERT INTO Recipe (recipe_id, name) 
VALUES (1, 'Chicken Salad');

INSERT INTO Recipe (recipe_id, name) 
VALUES (2, 'Protein Smoothie');

INSERT INTO Recipe (recipe_id, name) 
VALUES (3, 'Fried Rice');

INSERT INTO Recipe (recipe_id, name) 
VALUES (4, 'Steak Frites');

INSERT INTO Recipe (recipe_id, name) 
VALUES (5, 'Fettucine Alfredo');

INSERT INTO Recipe (recipe_id, name) 
VALUES (6, 'Chicken Fried Rice');

INSERT INTO UserInfo (user_id, username, weight, height, gender, age, recommended_calorie_intake)
VALUES (1, 'John Doe the 1st', 70.00, 175, 'Male', 30, 2500);

INSERT INTO UserInfo (user_id, username, weight, height, gender, age, recommended_calorie_intake)
VALUES (2, 'John Doe the 2nd', 80.00, 180, 'Male', 27, 2700);

INSERT INTO UserInfo (user_id, username, weight, height, gender, age, recommended_calorie_intake)
VALUES (3, 'John Doe the 3rd', 90.00, 177, 'Male', 22, 3000);

INSERT INTO UserInfo (user_id, username, weight, height, gender, age, recommended_calorie_intake)
VALUES (4, 'John Doe the 4th', 77.00, 185, 'Male', 26, 2800);

INSERT INTO UserInfo (user_id, username, weight, height, gender, age, recommended_calorie_intake)
VALUES (5, 'Janine Doe the 5th', 60.00, 170, 'Female', 32, 2300);

INSERT INTO Ingredient (name, brand, taste, macro_id, food_type) 
VALUES ('Tomato', 'Campbellas', 'sweeter than average', 1, 'vegetables');

INSERT INTO Ingredient (name, brand, taste, macro_id, food_type) 
VALUES ('Chicken Breast', 'Western Family', 'dryer than other brands', 2, 'poultry');

INSERT INTO Ingredient (name, brand, taste, macro_id, food_type) 
VALUES ('Parmesan Cheese', 'Western Family', 'more fragrant than average', 3, 'dairy');

INSERT INTO Ingredient (name, brand, taste, macro_id, food_type) 
VALUES ('Basil', 'Uncle Bens', 'looks fresher than average', 4, 'herbs');

INSERT INTO Ingredient (name, brand, taste, macro_id, food_type) 
VALUES ('Olive Oil', 'Las Espadas', 'more viscous compared to others', 5, 'oil');

INSERT INTO BodyBuilder (body_builder_id, training_duration_months, training_intensity) 
VALUES (1, 7, 50);

INSERT INTO BodyBuilder (body_builder_id, training_duration_months, training_intensity) 
VALUES (2, 8, 60);

INSERT INTO BodyBuilder (body_builder_id, training_duration_months, training_intensity) 
VALUES (3, 9, 70);

INSERT INTO BodyBuilder (body_builder_id, training_duration_months, training_intensity) 
VALUES (4, 10, 80);

INSERT INTO BodyBuilder (body_builder_id, training_duration_months, training_intensity) 
VALUES (5, 11, 90);

INSERT INTO MealRecord (meal_record_id, meal_record_date, user_id, recipe_id) 
VALUES (1, TO_DATE('2024-10-15', 'YYYY-MM-DD'), 1, 1);

INSERT INTO MealRecord (meal_record_id, meal_record_date, user_id, recipe_id) 
VALUES (2, TO_DATE('2024-10-12', 'YYYY-MM-DD'), 2, 2);

INSERT INTO MealRecord (meal_record_id, meal_record_date, user_id, recipe_id) 
VALUES (3, TO_DATE('2024-10-11', 'YYYY-MM-DD'), 3, 4);

INSERT INTO MealRecord (meal_record_id, meal_record_date, user_id, recipe_id) 
VALUES (4, TO_DATE('2024-10-10', 'YYYY-MM-DD'), 1, 5);

INSERT INTO MealRecord (meal_record_id, meal_record_date, user_id, recipe_id) 
VALUES (5, TO_DATE('2024-10-09', 'YYYY-MM-DD'), 2, 1);

INSERT INTO Goals (goal_id, start_date, end_date, goals_type, value_diff, user_id, macro_id) 
VALUES (1, TO_DATE('2024-10-01', 'YYYY-MM-DD'), TO_DATE('2024-12-31', 'YYYY-MM-DD'), 'Weight Loss', 5.50, 1, 1);

INSERT INTO Goals (goal_id, start_date, end_date, goals_type, value_diff, user_id, macro_id) 
VALUES (2, TO_DATE('2024-10-01', 'YYYY-MM-DD'), TO_DATE('2024-12-31', 'YYYY-MM-DD'), 'Weight Loss', 5.50, 2, 2);

INSERT INTO Goals (goal_id, start_date, end_date, goals_type, value_diff, user_id, macro_id) 
VALUES (3, TO_DATE('2024-10-01', 'YYYY-MM-DD'), TO_DATE('2024-12-31', 'YYYY-MM-DD'), 'Weight Loss', 5.60, 3, 3);

INSERT INTO Goals (goal_id, start_date, end_date, goals_type, value_diff, user_id, macro_id) 
VALUES (4, TO_DATE('2024-10-01', 'YYYY-MM-DD'), TO_DATE('2024-12-31', 'YYYY-MM-DD'), 'Weight Gain', 5.70, 4, 4);

INSERT INTO Goals (goal_id, start_date, end_date, goals_type, value_diff, user_id, macro_id) 
VALUES (5, TO_DATE('2024-10-01', 'YYYY-MM-DD'), TO_DATE('2024-12-31', 'YYYY-MM-DD'), 'Weight Gain', 5.50, 5, 5);

INSERT INTO ExerciseRecord (excercise_record_id, exercise_record_date, calories_burned, type, user_id) 
VALUES (1, TO_DATE('2024-10-15', 'YYYY-MM-DD'), 300, 'Running', 1);

INSERT INTO ExerciseRecord (excercise_record_id, exercise_record_date, calories_burned, type, user_id) 
VALUES (2, TO_DATE('2024-10-11', 'YYYY-MM-DD'), 300, 'Walking', 2);

INSERT INTO ExerciseRecord (excercise_record_id, exercise_record_date, calories_burned, type, user_id) 
VALUES (3, TO_DATE('2024-10-12', 'YYYY-MM-DD'), 500, 'Weight Lifting', 3);

INSERT INTO ExerciseRecord (excercise_record_id, exercise_record_date, calories_burned, type, user_id) 
VALUES (4, TO_DATE('2024-10-13', 'YYYY-MM-DD'), 700, 'Running', 4);

INSERT INTO ExerciseRecord (excercise_record_id, exercise_record_date, calories_burned, type, user_id) 
VALUES (5, TO_DATE('2024-10-14', 'YYYY-MM-DD'), 100, 'Swimming', 5);

INSERT INTO Consumes (recipe_id, user_id) 
VALUES (1, 1);

INSERT INTO Consumes (recipe_id, user_id) 
VALUES (2, 2);

INSERT INTO Consumes (recipe_id, user_id) 
VALUES (3, 3);

INSERT INTO Consumes (recipe_id, user_id) 
VALUES (4, 4);

INSERT INTO Consumes (recipe_id, user_id) 
VALUES (5, 5);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (1, 'Marinate chicken breasts', 1);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (2, 'Grill the chicken until cooked.', 1);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (3, 'Chop vegetables for the salad.', 1);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (4, 'Mix all the ingredients.', 1);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (1, 'Add frozen fruits to the blender', 2);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (2, 'Add water, protein powder, milk', 2);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (3, 'Blend until smooth', 2);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (1, 'Cook rice, or use day-old rice', 3);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (2, 'Stir-fry diced vegetables and protein in a hot pan.', 3);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (3, 'Then season with soy sauce', 3);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (1, 'Season steak, cook to preference.', 4);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (2, 'Fry potatoes until crispy.', 4);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (3, 'Butter bath the steak', 4);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (1, 'Cook pasta until al dente.', 5);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (2, 'Simmer cream, add cheese.', 5);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (3, 'Toss pasta in sauce.', 5);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (1, 'Cook the chicken until a light white color', 6);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (2, 'Add in the rice and stirfry for 2 minutes', 6);

INSERT INTO Step (step_number, description, recipe_id) 
VALUES (3, 'Add 5 grams of salt and 10 grams of soy sauce', 6);

INSERT INTO DiabeticPerson (diabetic_person_id, insulin_level, recommended_sugar_intake) 
VALUES (1, 5.00, 55);

INSERT INTO DiabeticPerson (diabetic_person_id, insulin_level, recommended_sugar_intake) 
VALUES (2, 6.50, 45);

INSERT INTO DiabeticPerson (diabetic_person_id, insulin_level, recommended_sugar_intake) 
VALUES (3, 7.80, 35);

INSERT INTO DiabeticPerson (diabetic_person_id, insulin_level, recommended_sugar_intake) 
VALUES (4, 9.20, 40);

INSERT INTO DiabeticPerson (diabetic_person_id, insulin_level, recommended_sugar_intake) 
VALUES (5, 9.80, 20);
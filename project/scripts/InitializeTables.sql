DROP TABLE MealRecord
DROP TABLE ExerciseRecord
DROP TABLE Goals
DROP TABLE Consumes
DROP TABLE BodyBuilder
DROP TABLE DiabeticPerson
DROP TABLE Ingredient
DROP TABLE Step
DROP TABLE Recipe
DROP TABLE Macros
DROP TABLE UserInfo
CREATE TABLE Macros (macro_id INT, fiber INT, sugar INT, fat INT, carbohydrates INT, protein INT, calories INT, PRIMARY KEY(macro_id))
CREATE TABLE Recipe (recipe_id INT, name VARCHAR(25) NOT NULL, PRIMARY KEY(recipe_id))
CREATE TABLE UserInfo (user_id INT, username VARCHAR(25) UNIQUE NOT NULL, weight DECIMAL(5,2), height DECIMAL(5,2), gender VARCHAR(15), age INT, recommended_calorie_intake INT, PRIMARY KEY (user_id))
CREATE TABLE Ingredient (name VARCHAR(255), brand VARCHAR(50), taste VARCHAR(255), macro_id INT NOT NULL, food_type VARCHAR(50), PRIMARY KEY(name, brand), FOREIGN KEY(macro_id) REFERENCES Macros (macro_id), UNIQUE (macro_id))
CREATE TABLE MealRecord (meal_record_id INT, meal_record_date DATE, user_id INT NOT NULL, recipe_id INT NOT NULL, PRIMARY KEY(meal_record_id), FOREIGN KEY (user_id) REFERENCES UserInfo(user_id), FOREIGN KEY (recipe_id) REFERENCES Recipe(recipe_id))
CREATE TABLE Goals (goal_id INT, start_date DATE, end_date DATE, goals_type VARCHAR(100), value_diff DECIMAL(5,2), PRIMARY KEY(goal_id), user_id INT NOT NULL, macro_id INT NOT NULL, UNIQUE (macro_id), FOREIGN KEY(user_id) REFERENCES UserInfo (user_id), FOREIGN KEY(macro_id) REFERENCES Macros (macro_id))
CREATE TABLE ExerciseRecord (excercise_record_id INT, exercise_record_date DATE, calories_burned INT, type VARCHAR(25), user_id INT NOT NULL, PRIMARY KEY(excercise_record_id), FOREIGN KEY (user_id) REFERENCES UserInfo (user_id))
CREATE TABLE Consumes (recipe_id INT, user_id INT, PRIMARY KEY(recipe_id, user_id), FOREIGN KEY(recipe_id) REFERENCES Recipe(recipe_id), FOREIGN KEY(user_id) REFERENCES UserInfo (user_id))
CREATE TABLE Step (step_number INT, description VARCHAR(55), recipe_id INT, PRIMARY KEY(step_number, recipe_id), FOREIGN KEY(recipe_id) REFERENCES Recipe(recipe_id) ON DELETE CASCADE)
CREATE TABLE BodyBuilder (body_builder_id INT, training_duration_months INT, training_intensity DECIMAL(5,2), PRIMARY KEY (body_builder_id), FOREIGN KEY (body_builder_id) REFERENCES UserInfo(user_id))
CREATE TABLE DiabeticPerson (diabetic_person_id INT, insulin_level DECIMAL(5,2), recommended_sugar_intake INT, PRIMARY KEY (diabetic_person_id), FOREIGN KEY (diabetic_person_id) REFERENCES UserInfo (user_id))
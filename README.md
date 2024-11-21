# Project Group 38: Personal Health Management App

## Overview
This project is a **personal health management app** designed to help users log and monitor their daily macro intake. Allows users to track their health goals based on individual factors, and provides tailored recipe suggestions to support their health objectives.

## Features
- **Tracking Macro Intake**
- **Goal Tracking**
- **Recipe Tracking and Suggestions**
- **Health Data Logging**

## Tech-Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: NodeJS, Express, oracledb, JavaScript

## For Dev
1. **Clone the Repository**: 
   ```bash
   git clone https://github.students.cs.ubc.ca/CPSC304-2024W-T1/project_k5l2e_k7i1t_v3d9u/
2. **cd into project and install npm in project**: 
   ```bash
   npm install

3. **Follow this [guide](https://www.students.cs.ubc.ca/~cs-304/resources/javascript-oracle-resources/node-setup.html#local-deploy-item) to install Oracle Client and keep track of the absolute path**

4. **Add a new variable to your .env file called ORACLE_DIR. Set its value to be the absolute path to your Oracle Instant Client.**:
   ```bash
   ORACLE_DIR='your absolute path here'

5. **run this script in your current terminal**: 
   ```bash
   .\scripts\win\db-tunnel.cmd
   
6. **In a separate terminal cd into project and run**:
   ```bash
   node server

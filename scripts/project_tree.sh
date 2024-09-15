#!/bin/bash

# Base project directory
PROJECT_NAME="canteen-management-portal"

# Backend directories
mkdir -p ${PROJECT_NAME}/backend/{controllers,models,routes,services,config,middleware,tests}

# Create backend entry file
touch ${PROJECT_NAME}/backend/app.js

# Frontend directories
mkdir -p ${PROJECT_NAME}/frontend/{components,services,assets,styles,tests}

# Create frontend entry file
touch ${PROJECT_NAME}/frontend/App.js

# Database directories
mkdir -p ${PROJECT_NAME}/database/migrations

# Documentation directory
mkdir -p ${PROJECT_NAME}/docs

# Scripts directory
mkdir -p ${PROJECT_NAME}/scripts

# Create README file
touch ${PROJECT_NAME}/README.md

# Confirm completion
echo "Directory structure for '${PROJECT_NAME}' created successfully."

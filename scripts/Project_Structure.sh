 
#!/bin/bash

# Base project directory
PROJECT_NAME="canteen-management-portal"

# Backend directories and files
mkdir -p ${PROJECT_NAME}/backend/{controllers,models,routes,services,config,middleware,tests}

# Create backend files
touch ${PROJECT_NAME}/backend/app.js
touch ${PROJECT_NAME}/backend/config/database.js
touch ${PROJECT_NAME}/backend/controllers/{userController.js,orderController.js,menuController.js,venueBookingController.js}
touch ${PROJECT_NAME}/backend/models/{User.js,Order.js,OrderItem.js,MenuItem.js,VenueBooking.js}
touch ${PROJECT_NAME}/backend/routes/{userRoutes.js,orderRoutes.js,menuRoutes.js,venueBookingRoutes.js}
touch ${PROJECT_NAME}/backend/services/{userService.js,orderService.js,menuService.js,venueBookingService.js}
touch ${PROJECT_NAME}/backend/middleware/authMiddleware.js
touch ${PROJECT_NAME}/backend/tests/{user.test.js,order.test.js,menu.test.js,venueBooking.test.js}

# Create sample content for backend files
echo "// Backend app entry point" > ${PROJECT_NAME}/backend/app.js
echo "// Database connection configuration" > ${PROJECT_NAME}/backend/config/database.js
echo "// Auth middleware" > ${PROJECT_NAME}/backend/middleware/authMiddleware.js

# Controllers
echo "// Controller logic for user operations" > ${PROJECT_NAME}/backend/controllers/userController.js
echo "// Controller logic for order operations" > ${PROJECT_NAME}/backend/controllers/orderController.js
echo "// Controller logic for menu operations" > ${PROJECT_NAME}/backend/controllers/menuController.js
echo "// Controller logic for venue booking operations" > ${PROJECT_NAME}/backend/controllers/venueBookingController.js

# Models
echo "// User model" > ${PROJECT_NAME}/backend/models/User.js
echo "// Order model" > ${PROJECT_NAME}/backend/models/Order.js
echo "// OrderItem model" > ${PROJECT_NAME}/backend/models/OrderItem.js
echo "// MenuItem model" > ${PROJECT_NAME}/backend/models/MenuItem.js
echo "// VenueBooking model" > ${PROJECT_NAME}/backend/models/VenueBooking.js

# Routes
echo "// User routes" > ${PROJECT_NAME}/backend/routes/userRoutes.js
echo "// Order routes" > ${PROJECT_NAME}/backend/routes/orderRoutes.js
echo "// Menu routes" > ${PROJECT_NAME}/backend/routes/menuRoutes.js
echo "// Venue booking routes" > ${PROJECT_NAME}/backend/routes/venueBookingRoutes.js

# Services
echo "// User service for API calls" > ${PROJECT_NAME}/backend/services/userService.js
echo "// Order service for API calls" > ${PROJECT_NAME}/backend/services/orderService.js
echo "// Menu service for API calls" > ${PROJECT_NAME}/backend/services/menuService.js
echo "// Venue booking service for API calls" > ${PROJECT_NAME}/backend/services/venueBookingService.js

# Tests
echo "// User tests" > ${PROJECT_NAME}/backend/tests/user.test.js
echo "// Order tests" > ${PROJECT_NAME}/backend/tests/order.test.js
echo "// Menu tests" > ${PROJECT_NAME}/backend/tests/menu.test.js
echo "// Venue booking tests" > ${PROJECT_NAME}/backend/tests/venueBooking.test.js

# Frontend directories and files
mkdir -p ${PROJECT_NAME}/frontend/{components,services,assets,styles,tests}

# Create frontend files
touch ${PROJECT_NAME}/frontend/App.js
touch ${PROJECT_NAME}/frontend/components/{UserRegistration.js,UserLogin.js,UserProfile.js,OrderForm.js,OrderHistory.js,MenuItemsList.js,VenueBookingForm.js}
touch ${PROJECT_NAME}/frontend/services/{userService.js,orderService.js,menuService.js,venueBookingService.js}
touch ${PROJECT_NAME}/frontend/tests/{App.test.js,UserRegistration.test.js,OrderForm.test.js}

# Create sample content for frontend files
echo "// Frontend app entry point" > ${PROJECT_NAME}/frontend/App.js

# Components
echo "// User registration component" > ${PROJECT_NAME}/frontend/components/UserRegistration.js
echo "// User login component" > ${PROJECT_NAME}/frontend/components/UserLogin.js
echo "// User profile component" > ${PROJECT_NAME}/frontend/components/UserProfile.js
echo "// Order form component" > ${PROJECT_NAME}/frontend/components/OrderForm.js
echo "// Order history component" > ${PROJECT_NAME}/frontend/components/OrderHistory.js
echo "// Menu items list component" > ${PROJECT_NAME}/frontend/components/MenuItemsList.js
echo "// Venue booking form component" > ${PROJECT_NAME}/frontend/components/VenueBookingForm.js

# Services
echo "// Frontend user service" > ${PROJECT_NAME}/frontend/services/userService.js
echo "// Frontend order service" > ${PROJECT_NAME}/frontend/services/orderService.js
echo "// Frontend menu service" > ${PROJECT_NAME}/frontend/services/menuService.js
echo "// Frontend venue booking service" > ${PROJECT_NAME}/frontend/services/venueBookingService.js

# Tests
echo "// App tests" > ${PROJECT_NAME}/frontend/tests/App.test.js
echo "// User registration tests" > ${PROJECT_NAME}/frontend/tests/UserRegistration.test.js
echo "// Order form tests" > ${PROJECT_NAME}/frontend/tests/OrderForm.test.js

# Database directory and files
mkdir -p ${PROJECT_NAME}/database/migrations
touch ${PROJECT_NAME}/database/migrations/init.sql
echo "-- SQL for initial database setup" > ${PROJECT_NAME}/database/migrations/init.sql

# Documentation directory
mkdir -p ${PROJECT_NAME}/docs
touch ${PROJECT_NAME}/docs/{API.md,UserGuide.md,DatabaseSchema.md}

# Create sample content for documentation
echo "# API Documentation" > ${PROJECT_NAME}/docs/API.md
echo "# User Guide" > ${PROJECT_NAME}/docs/UserGuide.md
echo "# Database Schema" > ${PROJECT_NAME}/docs/DatabaseSchema.md

# Scripts directory
mkdir -p ${PROJECT_NAME}/scripts
touch ${PROJECT_NAME}/scripts/deploy.sh
echo "#!/bin/bash" > ${PROJECT_NAME}/scripts/deploy.sh
echo "# Deployment script placeholder" >> ${PROJECT_NAME}/scripts/deploy.sh
chmod +x ${PROJECT_NAME}/scripts/deploy.sh

# Create README file
touch ${PROJECT_NAME}/README.md
echo "# Canteen Management Portal" > ${PROJECT_NAME}/README.md

# Confirm completion
echo "Directory structure and files for '${PROJECT_NAME}' created successfully."

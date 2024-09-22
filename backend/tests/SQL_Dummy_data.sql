 
-- Use your database
USE canteen_management;

-- Insert Users
INSERT INTO Users (employeeID, firstName, lastName, email, passwordHash, userType, createdAt, updatedAt) VALUES
('EMP001', 'Aarav', 'Sharma', 'aarav.sharma@example.com', 'hashed_password_1', 'employee', NOW(), NOW()),
('EMP002', 'Vivaan', 'Patel', 'vivaan.patel@example.com', 'hashed_password_2', 'admin', NOW(), NOW()),
('EMP003', 'Vihaan', 'Mehta', 'vihaan.mehta@example.com', 'hashed_password_3', 'employee', NOW(), NOW()),
('EMP004', 'Aditya', 'Gupta', 'aditya.gupta@example.com', 'hashed_password_4', 'employee', NOW(), NOW()),
('EMP005', 'Reyansh', 'Joshi', 'reyansh.joshi@example.com', 'hashed_password_5', 'employee', NOW(), NOW()),
('EMP006', 'Arjun', 'Reddy', 'arjun.reddy@example.com', 'hashed_password_6', 'admin', NOW(), NOW()),
('EMP007', 'Sai', 'Kumar', 'sai.kumar@example.com', 'hashed_password_7', 'employee', NOW(), NOW()),
('EMP008', 'Anaya', 'Choudhury', 'anaya.choudhury@example.com', 'hashed_password_8', 'employee', NOW(), NOW()),
('EMP009', 'Diya', 'Nair', 'diya.nair@example.com', 'hashed_password_9', 'employee', NOW(), NOW()),
('EMP010', 'Kavya', 'Rao', 'kavya.rao@example.com', 'hashed_password_10', 'admin', NOW(), NOW());

-- Insert Ingredients
INSERT INTO Ingredients (name, quantityAvailable, unit, createdAt, updatedAt) VALUES
('Basmati Rice', 100, 'kg', NOW(), NOW()),
('Wheat Flour', 200, 'kg', NOW(), NOW()),
('Lentils', 150, 'kg', NOW(), NOW()),
('Tomatoes', 50, 'kg', NOW(), NOW()),
('Onions', 80, 'kg', NOW(), NOW()),
('Cilantro', 20, 'kg', NOW(), NOW()),
('Ginger', 15, 'kg', NOW(), NOW()),
('Garlic', 10, 'kg', NOW(), NOW()),
('Spices Mix', 25, 'kg', NOW(), NOW()),
('Paneer', 30, 'kg', NOW(), NOW());

-- Insert MenuItems
INSERT INTO MenuItems (name, description, price, rating, createdAt, updatedAt) VALUES
('Biryani', 'Aromatic rice dish with spices and meat or vegetables', 250.00, 4.7, NOW(), NOW()),
('Paneer Butter Masala', 'Paneer cooked in creamy tomato gravy', 200.00, 4.8, NOW(), NOW()),
('Chole Bhature', 'Spicy chickpeas served with deep-fried bread', 150.00, 4.6, NOW(), NOW()),
('Masala Dosa', 'Crispy rice crepe filled with spiced potatoes', 120.00, 4.5, NOW(), NOW()),
('Pav Bhaji', 'Spicy vegetable mash served with buttered bread', 100.00, 4.4, NOW(), NOW()),
('Samosa', 'Fried pastry filled with spiced potatoes and peas', 50.00, 4.3, NOW(), NOW()),
('Aloo Gobi', 'Potatoes and cauliflower cooked with spices', 90.00, 4.6, NOW(), NOW()),
('Palak Paneer', 'Spinach and paneer cooked with spices', 180.00, 4.7, NOW(), NOW()),
('Butter Chicken', 'Chicken cooked in a rich, buttery gravy', 300.00, 4.9, NOW(), NOW()),
('Gulab Jamun', 'Sweet syrup-soaked dumplings', 80.00, 4.8, NOW(), NOW());

-- Insert MenuItemIngredients
INSERT INTO MenuItemIngredients (MenuItemId, IngredientId, quantityUsed, createdAt, updatedAt) VALUES
(1, 1, 0.5, NOW(), NOW()),  -- Biryani: 0.5 kg Basmati Rice
(1, 4, 0.2, NOW(), NOW()),  -- Biryani: 0.2 kg Tomatoes
(1, 9, 0.1, NOW(), NOW()),  -- Biryani: 0.1 kg Spices Mix
(2, 10, 0.25, NOW(), NOW()), -- Paneer Butter Masala: 0.25 kg Paneer
(2, 4, 0.15, NOW(), NOW()),  -- Paneer Butter Masala: 0.15 kg Tomatoes
(3, 3, 0.3, NOW(), NOW()),   -- Chole Bhature: 0.3 kg Lentils
(3, 5, 0.2, NOW(), NOW()),   -- Chole Bhature: 0.2 kg Onions
(4, 1, 0.2, NOW(), NOW()),   -- Masala Dosa: 0.2 kg Basmati Rice
(4, 6, 0.1, NOW(), NOW()),   -- Masala Dosa: 0.1 kg Cilantro
(5, 7, 0.1, NOW(), NOW()),   -- Pav Bhaji: 0.1 kg Ginger
(6, 5, 0.15, NOW(), NOW()),  -- Samosa: 0.15 kg Onions
(7, 4, 0.2, NOW(), NOW()),   -- Aloo Gobi: 0.2 kg Tomatoes
(8, 10, 0.3, NOW(), NOW()),  -- Palak Paneer: 0.3 kg Paneer
(9, 10, 0.25, NOW(), NOW()), -- Butter Chicken: 0.25 kg Chicken
(10, 1, 0.1, NOW(), NOW()),   -- Gulab Jamun: 0.1 kg Basmati Rice
(10, 5, 0.1, NOW(), NOW());   -- Gulab Jamun: 0.1 kg Onions

-- Insert Orders
INSERT INTO Orders (totalCost, orderDate, createdAt, updatedAt) VALUES
(1200.00, NOW(), NOW(), NOW()),
(600.00, NOW(), NOW(), NOW()),
(800.00, NOW(), NOW(), NOW()),
(400.00, NOW(), NOW(), NOW()),
(950.00, NOW(), NOW(), NOW()),
(300.00, NOW(), NOW(), NOW()),
(1500.00, NOW(), NOW(), NOW()),
(700.00, NOW(), NOW(), NOW()),
(850.00, NOW(), NOW(), NOW()),
(500.00, NOW(), NOW(), NOW());

-- Insert OrderItems
INSERT INTO OrderItems (quantity, subTotal, createdAt, updatedAt) VALUES
(2, 500.00, NOW(), NOW()), -- 2 items for the first order
(1, 250.00, NOW(), NOW()), -- 1 item for the second order
(3, 900.00, NOW(), NOW()), -- 3 items for the third order
(1, 200.00, NOW(), NOW()), -- 1 item for the fourth order
(4, 480.00, NOW(), NOW()), -- 4 items for the fifth order
(1, 150.00, NOW(), NOW()), -- 1 item for the sixth order
(5, 1250.00, NOW(), NOW()), -- 5 items for the seventh order
(2, 400.00, NOW(), NOW()), -- 2 items for the eighth order
(3, 750.00, NOW(), NOW()), -- 3 items for the ninth order
(1, 200.00, NOW(), NOW()); -- 1 item for the tenth order

-- Link OrderItems to Orders and MenuItems
UPDATE OrderItems SET OrderId = 1, MenuItemId = 1 WHERE id = 1; -- First order item links to first order and first menu item
UPDATE OrderItems SET OrderId = 2, MenuItemId = 2 WHERE id = 2; -- Second order item links to second order and second menu item
UPDATE OrderItems SET OrderId = 3, MenuItemId = 3 WHERE id = 3; -- Third order item links to third order and third menu item
UPDATE OrderItems SET OrderId = 4, MenuItemId = 4 WHERE id = 4; -- Fourth order item links to fourth order and fourth menu item
UPDATE OrderItems SET OrderId = 5, MenuItemId = 5 WHERE id = 5; -- Fifth order item links to fifth order and fifth menu item
UPDATE OrderItems SET OrderId = 6, MenuItemId = 6 WHERE id = 6; -- Sixth order item links to sixth order and sixth menu item
UPDATE OrderItems SET OrderId = 7, MenuItemId = 7 WHERE id = 7; -- Seventh order item links to seventh order and seventh menu item
UPDATE OrderItems SET OrderId = 8, MenuItemId = 8 WHERE id = 8; -- Eighth order item links to eighth order and eighth menu item
UPDATE OrderItems SET OrderId = 9, MenuItemId = 9 WHERE id = 9; -- Ninth order item links to ninth order and ninth menu item
UPDATE OrderItems SET OrderId = 10, MenuItemId = 10 WHERE id = 10; -- Tenth order item links to tenth order and tenth menu item

-- Insert VenueBookings
INSERT INTO VenueBookings (bookingDate, bookingTime, reservationStart, reservationEnd, purpose, venue, status, createdAt, updatedAt) VALUES
('2024-09-20', '10:00:00', '2024-09-20 10:00:00', '2024-09-20 12:00:00', 'Team Meeting', 'Conference Room A', 'approved', NOW(), NOW()),
('2024-09-21', '11:00:00', '2024-09-21 11:00:00', '2024-09-21 13:00:00', 'Birthday Party', 'Garden Area', 'pending', NOW(), NOW()),
('2024-09-22', '15:00:00', '2024-09-22 15:00:00', '2024-09-22 17:00:00', 'Networking Event', 'Main Hall', 'approved', NOW(), NOW()),
('2024-09-23', '12:00:00', '2024-09-23 12:00:00', '2024-09-23 14:00:00', 'Family Gathering', 'Garden Area', 'pending', NOW(), NOW()),
('2024-09-24', '09:00:00', '2024-09-24 09:00:00', '2024-09-24 11:00:00', 'Client Meeting', 'Room A', 'approved', NOW(), NOW()),
('2024-09-25', '16:00:00', '2024-09-25 16:00:00', '2024-09-25 18:00:00', 'Training Session', 'Room B', 'pending', NOW(), NOW()),
('2024-09-26', '10:00:00', '2024-09-26 10:00:00', '2024-09-26 12:00:00', 'Product Launch', 'Conference Room C', 'approved', NOW(), NOW()),
('2024-09-27', '14:00:00', '2024-09-27 14:00:00', '2024-09-27 16:00:00', 'Community Event', 'Hall D', 'pending', NOW(), NOW()),
('2024-09-28', '11:00:00', '2024-09-28 11:00:00', '2024-09-28 13:00:00', 'Annual Meeting', 'Main Hall', 'approved', NOW(), NOW()),
('2024-09-29', '09:00:00', '2024-09-29 09:00:00', '2024-09-29 10:00:00', 'Workshop', 'Room C', 'pending', NOW(), NOW());

-- Link VenueBookings to Users
UPDATE VenueBookings SET UserId = 1 WHERE id = 1; -- First booking links to Aarav
UPDATE VenueBookings SET UserId = 2 WHERE id = 2; -- Second booking links to Vivaan
UPDATE VenueBookings SET UserId = 3 WHERE id = 3; -- Third booking links to Vihaan
UPDATE VenueBookings SET UserId = 4 WHERE id = 4; -- Fourth booking links to Aditya
UPDATE VenueBookings SET UserId = 5 WHERE id = 5; -- Fifth booking links to Reyansh
UPDATE VenueBookings SET UserId = 6 WHERE id = 6; -- Sixth booking links to Arjun
UPDATE VenueBookings SET UserId = 7 WHERE id = 7; -- Seventh booking links to Sai
UPDATE VenueBookings SET UserId = 8 WHERE id = 8; -- Eighth booking links to Anaya
UPDATE VenueBookings SET UserId = 9 WHERE id = 9; -- Ninth booking links to Diya
UPDATE VenueBookings SET UserId = 10 WHERE id = 10; -- Tenth booking links to Kavya

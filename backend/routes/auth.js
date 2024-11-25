const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dbFile = path.join(__dirname, '../db.json');
const secretKey = 'your_secret_key';

// Helper functions to read/write JSON
function readDB() {
    return JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
}

function writeDB(data) {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// Signup route for admin
router.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;

    if (role !== 'admin') {
        return res.status(403).json({ message: 'Only admin accounts can be created' });
    }

    const db = readDB();
    const existingAdmin = db.admins.find(admin => admin.username === username);
    if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.admins.push({ id: Date.now(), username, password: hashedPassword, role });
    writeDB(db);

    res.status(201).json({ message: 'Admin account created successfully' });
});

// Login route for admin
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const db = readDB();
    const admin = db.admins.find(admin => admin.username === username);
    if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, role: admin.role }, secretKey, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
});

// Add User route for admins
router.post('/add-user', async (req, res) => {
    const { name, email, phone, status, role, permissions } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        // Ensure the requester is an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can add users' });
        }

        const db = readDB();

        // Check if email already exists
        const existingUser = db.users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Add the new user to the database
        const newUser = {
            id: Date.now(),
            name,
            email,
            phone,
            status,
            role,
            permissions,
        };

        db.users.push(newUser); // Add to the `users` array
        writeDB(db);

        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token or session expired' });
    }
});

// Get all users route for admins
router.get('/users', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        // Ensure the requester is an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can view users' });
        }

        const db = readDB();

        // Return all users
        res.status(200).json({ users: db.users });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token or session expired' });
    }
});

// Get the single User route for admins
router.get('/users/:id', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const id = req.params.id;
    const db = readDB();
    const user = db.users.find(user => user.id === parseInt(id));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        // Ensure the requester is an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can view users' });
        }
        res.status(200).json({ user });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token or session expired' });
    }
});

// Edit User route for admins
router.put('/edituser/:id', async (req, res) => {
    const { name, email, phone, status, role, permissions } = req.body;
    const userId = req.params.id;
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can edit users' });
        }

        const db = readDB();

        // Find the user in the database
        const userIndex = db.users.findIndex(user => user.id === parseInt(userId));
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's information
        const updatedUser = {
            ...db.users[userIndex],
            name: name || db.users[userIndex].name,
            email: email || db.users[userIndex].email,
            phone: phone || db.users[userIndex].phone,
            status: status || db.users[userIndex].status,
            role: role || db.users[userIndex].role,
            permissions: permissions || db.users[userIndex].permissions,
        };

        db.users[userIndex] = updatedUser;
        writeDB(db);

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token or session expired' });
    }
});

// Delete User route for admins
router.delete('/deleteuser/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const token = req.headers['authorization']?.split(' ')[1];
        const db = readDB();
        
        const decoded = jwt.verify(token, secretKey);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can delete users' });
        }

        const userIndex = db.users.findIndex(user => user.id === parseInt(userId));
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        db.users.splice(userIndex, 1);
        writeDB(db);
        
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token or session expired' });
    }
});


// Get User Statistics route for admins
router.get('/user-statistics', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        // Ensure the requester is an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can view user statistics' });
        }

        const db = readDB();

        // Total number of users
        const totalUsers = db.users.length;

        // Users registered today
        const today = new Date().setHours(0, 0, 0, 0); // Start of today
        const usersRegisteredToday = db.users.filter(user => new Date(user.id).setHours(0, 0, 0, 0) === today).length;

        // Count of active users
        const activeUsers = db.users.filter(user => user.status === 'active').length;

        // Count of inactive users
        const inactiveUsers = db.users.filter(user => user.status === 'inactive').length;

        // Return statistics
        res.status(200).json({
            totalUsers,
            usersRegisteredToday,
            activeUsers,
            inactiveUsers
        });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token or session expired' });
    }
});



module.exports = router;


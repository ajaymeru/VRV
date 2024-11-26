const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dbFile = path.join(__dirname, '../db.json');
const secretKey = 'your_secret_key';

function readDB() {
    return JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
}

function writeDB(data) {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// Signup route for admin
router.post('/signup', async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    if (role !== 'admin') {
        return res.status(403).json({ message: 'Only admin accounts can be created' });
    }

    const db = readDB();
    const existingAdmin = db.admins.find(admin => admin.email === email);
    if (existingAdmin) {
        return res.status(400).json({ message: 'Admin with this email already exists.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.admins.push({ id: Date.now(), email, password: hashedPassword, role });
        writeDB(db);

        res.status(201).json({ message: 'Admin account created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin account.', error: error.message });
    }
});

// Login route for admin
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const db = readDB();
    const admin = db.admins.find(admin => admin.email === email);
    if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
    }

    try {
        const isPasswordValid = await bcrypt.compare(password, admin.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ email: admin.email, role: admin.role }, secretKey, {expiresIn:'10h'})
        res.json({message:"Login Sucessfull", token})

    } catch (error) {
        res.status(500).json({ message: 'Error logging in admin.', error: error.message })
    }
});

// Add User route for admins
router.post('/add-user', async (req, res) => {
    const { name, email, phone, age, role, permissions } = req.body; 
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);

       
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can add users' });
        }

        const db = readDB();

        const existingUser = db.users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            phone,
            age,
            status: "Active", 
            role,
            permissions,
        };

        db.users.push(newUser);
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

       
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can view users' });
        }

        const db = readDB();

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

       
        const userIndex = db.users.findIndex(user => user.id === parseInt(userId));
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

   
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

       
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can view user statistics' });
        }

        const db = readDB();

        const totalUsers = db.users.length;

        const today = new Date().setHours(0, 0, 0, 0); 
        const usersRegisteredToday = db.users.filter(user => new Date(user.id).setHours(0, 0, 0, 0) === today).length;

        const activeUsers = db.users.filter(user => user.status === 'Active').length;

        const inactiveUsers = db.users.filter(user => user.status === 'Inactive').length;

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


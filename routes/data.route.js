const express = require('express');
const router = express.Router();
const dataController = require('../controller/data.controller');
const auth = require('../middleware/data.middleware'); 
const upload = require('../middleware/upload');

// Get current user data
router.get('/me', auth, dataController.getMe);

// Update user profile (including profile picture)
router.put('/', auth, upload.single('profilePicture'), dataController.updateUser);

// Delete user account
router.delete('/', auth, dataController.deleteUser);

// Separate endpoint for profile picture upload (optional - if you want a dedicated endpoint)
router.post('/upload-avatar', auth, upload.single('profilePicture'), dataController.uploadProfilePicture);

// Serve uploaded images (add this to your main app if not already present)
// This should be in your main app.js or server.js file:
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = router;
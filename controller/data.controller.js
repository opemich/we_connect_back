const FormData = require('../model/formData.model');
const fs = require('fs');
const path = require('path');

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await FormData.findById(req.user.id).select('-password -tokens');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Extract names from full name
    const fullName = user.fullname?.trim() || '';
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0] || '';
    const lastName = nameParts[1] || '';

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        firstName,
        lastName
      }
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};


// Update user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const allowedUpdates = ['username', 'firstName', 'lastName', 'bio'];
    const updates = {};

    // Only include allowed fields that are present in the request
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Handle profile picture upload
    if (req.file) {
      // Get current user to delete old image
      const currentUser = await FormData.findById(userId);
      if (currentUser && currentUser.profilePicture) {
        const oldImagePath = path.join(__dirname, '..', currentUser.profilePicture);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (deleteErr) {
            console.error('Error deleting old image:', deleteErr);
          }
        }
      }
      
      updates.profilePicture = `/uploads/${req.file.filename}`;
    }

    // Validate that we have something to update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    const updatedUser = await FormData.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -tokens');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (err) {
    console.error('Update user error:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user data before deletion to clean up files
    const user = await FormData.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete profile picture if exists
    if (user.profilePicture) {
      const imagePath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (deleteErr) {
          console.error('Error deleting profile picture:', deleteErr);
        }
      }
    }

    // Delete user from database
    await FormData.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Account deleted successfully'
    });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Upload profile picture (separate endpoint if needed)
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const userId = req.user.id;
    const profilePicturePath = `/uploads/${req.file.filename}`;

    // Get current user to delete old image
    const currentUser = await FormData.findById(userId);
    if (currentUser && currentUser.profilePicture) {
      const oldImagePath = path.join(__dirname, '..', currentUser.profilePicture);
      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (deleteErr) {
          console.error('Error deleting old image:', deleteErr);
        }
      }
    }

    // Update user with new profile picture
    const updatedUser = await FormData.findByIdAndUpdate(
      userId,
      { $set: { profilePicture: profilePicturePath } },
      { new: true }
    ).select('-password -tokens');

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Profile picture uploaded successfully'
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({
      success: false,
      message: 'Upload failed'
    });
  }
};

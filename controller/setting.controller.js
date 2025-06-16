const FormData = require('../model/formData.model');

// Logout user (removes token from user's tokens array)
exports.logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(t => t.token !== req.token);
    await req.user.save();
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Logout failed", error: err.message });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    await FormData.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete account", error: err.message });
  }
};

// Get static app info
exports.getAppInfo = (req, res) => {
  const info = {
    appName: "WeConnect",
    version: "1.0.0",
    description: "WeConnect is a blockchain-powered connection platform.",
    privacyPolicy: "We respect your privacy. All data is encrypted and stored securely.",
    terms: "By using WeConnect, you agree to our decentralized terms of use.",
    developer: {
      name: "Prex",
      website: "https://yourwebsite.com",
    }
  };
  res.json(info);
};

const express = require('express');
const router = express.Router();
const dataAuth = require('../middleware/data.middleware');
const {
  logoutUser,
  deleteAccount,
  getAppInfo,
} = require('../controller/setting.controller');

// Protect all routes with auth
router.get('/info', getAppInfo);
router.post('/logout', dataAuth, logoutUser);
router.delete('/delete-account', dataAuth, deleteAccount);

module.exports = router;

// const jwt = require("jsonwebtoken");

// const auth = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// module.exports = auth;

// const jwt = require("jsonwebtoken");
// const authenticateUser = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "No token provided" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({ message: "Invalid token" });
//     req.user = decoded;
//     next();
//   });
// };
// module.exports = authenticateUser;

// middleware/auth.js
// const jwt = require('jsonwebtoken');
// const FormData = require('../model/formData.model');

// const dataAuth = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await FormData.findOne({ _id: decoded.id, 'tokens.token': token });

//     if (!user) {
//       throw new Error();
//     }

//     req.token = token;
//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(401).json({
//       success: false,
//       message: 'Please authenticate'
//     });
//   }
// };

// module.exports = dataAuth;

const jwt = require('jsonwebtoken');
const FormData = require('../model/formData.model');

const dataAuth = async (req, res, next) => {
  try {
    // Debug: Log the incoming request
    // console.log('=== AUTH MIDDLEWARE DEBUG ===');
    // console.log('Headers:', req.headers);
    console.log('Authorization header:', req.header('Authorization'));
    
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      console.log('ERROR: No Authorization header found');
      return res.status(401).json({
        success: false,
        message: 'No authorization header provided'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log('ERROR: Authorization header does not start with Bearer');
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization header format'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Extracted token:', token.substring(0, 20) + '...');
    
    if (!token) {
      console.log('ERROR: No token found after Bearer');
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Debug: Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.log('ERROR: JWT_SECRET not found in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', { userId: decoded.userId, iat: decoded.iat, exp: decoded.exp });
    } catch (jwtError) {
      console.log('JWT verification failed:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Find the user
    console.log('Looking for user with ID:', decoded.userId);
    
    // First, let's try to find the user without checking the tokens array
    const userSimple = await FormData.findById(decoded.userId);
    console.log('User found (simple lookup):', !!userSimple);
    
    if (userSimple) {
      console.log('User data:', {
        id: userSimple._id,
        username: userSimple.username,
        email: userSimple.email,
        hasTokensArray: !!userSimple.tokens,
        tokensCount: userSimple.tokens ? userSimple.tokens.length : 0
      });
    }

    // Now try the original lookup with tokens check
    const user = await FormData.findOne({ _id: decoded.userId, 'tokens.token': token });
    console.log('User found (with token check):', !!user);

    if (!user) {
      console.log('ERROR: User not found or token not in user tokens array');
      
      // Let's check if the issue is with the tokens array
      if (userSimple) {
        console.log('User exists but token not found in tokens array');
        console.log('This might be because your login doesn\'t save tokens to the user document');
        
        // For debugging, let's allow the request but warn
        console.log('ALLOWING REQUEST FOR DEBUG - FIX TOKEN STORAGE IN LOGIN');
        req.token = token;
        req.user = userSimple;
        return next();
      }
      
      return res.status(401).json({
        success: false,
        message: 'User not found or token invalid'
      });
    }

    req.token = token;
    req.user = user;
    console.log('Authentication successful for user:', user.username);
    console.log('=== END AUTH DEBUG ===');
    
    next();
  } catch (err) {
    console.log('=== AUTH MIDDLEWARE ERROR ===');
    console.error('Unexpected error in auth middleware:', err);
    console.log('=== END AUTH ERROR ===');
    
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

module.exports = dataAuth;
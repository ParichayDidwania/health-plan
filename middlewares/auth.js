const { OAuth2Client } = require('google-auth-library');
const { CustomError, ERROR_TYPES } = require('../error-manager/errorManager');
const jwt = require('jsonwebtoken');

const verifyGoogleToken = async (token) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    try {
        await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
    } catch (error) {
        return next(new CustomError(ERROR_TYPES.UNAUTHORIZED));
    }
}

const ALLOWED_ISSUERS = {
    [process.env.GOOGLE_ISSUER] : verifyGoogleToken
}

const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return next(new CustomError(ERROR_TYPES.UNAUTHORIZED));
    }

    const decoded = jwt.decode(token);
    if (!decoded) {
        return next(new CustomError(ERROR_TYPES.UNAUTHORIZED));
    }

    const iss = decoded.iss;

    if (ALLOWED_ISSUERS[iss]) {
        ALLOWED_ISSUERS[iss](token);
        next();
    } else {
        return next(new CustomError(ERROR_TYPES.UNAUTHORIZED));
    }
}

module.exports = auth;

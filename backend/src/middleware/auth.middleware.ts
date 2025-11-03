import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// We extend the Request object in TypeScript.
// Because we are going to newly add a property named 'req.user'.
declare global {
  namespace Express {
    interface Request {
      user?: any; // (We will store the payload here)
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let token;

  // 1. Check whether 'Authorization' exists in the header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Remove the word 'Bearer ' and extract only the token
      //    eg: "Bearer eyJhbGci..." -> "eyJhbGci..."
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using the secret stored in .env
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is not defined');
      }

      // Decode the token and receive the payload (eg: { userId: '123' })
      const decodedPayload = jwt.verify(token, secret);

      // 4. If the token is valid, attach user data to 'req.user'
      //    (Now all routes after this can access 'req.user')
      req.user = decodedPayload;

      // 5. Gatekeeper allows the request to move forward (next middleware/controller)
      next();

    } catch (error) {
      // If something goes wrong while verifying the token (eg: expired token)
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // 6. If 'Authorization' header does not exist, or does not start with 'Bearer'
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default authMiddleware;

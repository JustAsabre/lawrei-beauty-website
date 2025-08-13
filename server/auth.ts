import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

// Environment variables with defaults for development
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // "password" hashed

export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
}

export class AuthService {
  /**
   * Generate a JWT token for a user
   */
  static generateToken(payload: JWTPayload): string {
    const expiresIn = JWT_EXPIRES_IN || '24h';
    const options = { expiresIn } as jwt.SignOptions;
    return jwt.sign(
      payload,
      JWT_SECRET as string,
      options
    );
  }

  /**
   * Verify a JWT token
   */
  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET as string) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Hash a password
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify a password against a hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Authenticate admin credentials
   */
  static async authenticateAdmin(username: string, password: string): Promise<boolean> {
    if (username !== ADMIN_USERNAME) {
      return false;
    }
    
    return this.verifyPassword(password, ADMIN_PASSWORD_HASH);
  }

  /**
   * Middleware to authenticate JWT tokens
   */
  static authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const payload = AuthService.verifyToken(token);
    if (!payload) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Add user info to request object
    (req as any).user = payload;
    next();
  }

  /**
   * Middleware to check admin role
   */
  static requireAdmin(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  }
}

// Utility function to generate a password hash (for setting up admin password)
export async function generatePasswordHash(password: string): Promise<string> {
  return AuthService.hashPassword(password);
}
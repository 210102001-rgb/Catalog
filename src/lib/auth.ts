// Import types
interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  password_hash?: string | null;
  role: string;
  user_type: string;
  company_name?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  status: string;
  email_verified: boolean;
  email_verified_at?: Date | null;
  npwp_verified: boolean;
  npwp_valid_until?: Date | null;
  balance: any; // Decimal type
  points: number;
  last_login_at?: Date | null;
  last_login_ip?: string | null;
  remember_token?: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    uuid: user.uuid,
    email: user.email,
    role: user.role,
    userType: user.user_type,
  };

  const secret = process.env.JWT_SECRET || "fallback_secret_key";
  const expiresIn = process.env.JWT_EXPIRES_IN || "24h";

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const isAdmin = (user: User): boolean => {
  return user.role === "ADMIN";
};

export const isCustomer = (user: User): boolean => {
  return user.role === "CUSTOMER";
};

export function getUserFromRequest(req: NextApiRequest): User | null {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return null;
  }

  try {
    const decoded = verifyToken(token);
    // In a real implementation, we would fetch the full user from the database
    // Here we're returning a partial user object with essential data from the token
    return {
      id: decoded.id,
      uuid: decoded.uuid,
      email: decoded.email,
      role: decoded.role,
      user_type: decoded.userType,
      name: decoded.name || "",
      password_hash: null,
      company_name: decoded.companyName || null,
      phone: null,
      address: null,
      city: null,
      postal_code: null,
      status: decoded.status || "ACTIVE",
      email_verified: false,
      email_verified_at: null,
      npwp_verified: false,
      npwp_valid_until: null,
      balance: { toString: () => "0" } as any, // Placeholder for Decimal
      points: 0,
      last_login_at: null,
      last_login_ip: null,
      remember_token: null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    } as unknown as User;
  } catch (error) {
    return null;
  }
}

export function getUserFromNextRequest(request: NextRequest): User | null {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return null;
  }

  try {
    const decoded = verifyToken(token);
    // In a real implementation, we would fetch the full user from the database
    // Here we're returning a partial user object with essential data from the token
    return {
      id: decoded.id,
      uuid: decoded.uuid,
      email: decoded.email,
      role: decoded.role,
      user_type: decoded.userType,
      name: decoded.name || "",
      password_hash: null,
      company_name: decoded.companyName || null,
      phone: null,
      address: null,
      city: null,
      postal_code: null,
      status: decoded.status || "ACTIVE",
      email_verified: false,
      email_verified_at: null,
      npwp_verified: false,
      npwp_valid_until: null,
      balance: { toString: () => "0" } as any, // Placeholder for Decimal
      points: 0,
      last_login_at: null,
      last_login_ip: null,
      remember_token: null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    } as unknown as User;
  } catch (error) {
    return null;
  }
}

export function isAuthenticated(user: User | null): boolean {
  return user !== null;
}

export function requireAuth(handler: (req: NextRequest, user: User) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    // Get user from request headers first
    let user = getUserFromNextRequest(request);

    // If no user from headers, try to get from cookies
    if (!user || !user.id) {
      const token = request.cookies.get("auth_token")?.value;
      if (token) {
        try {
          const decoded = verifyToken(token);
          // We don't have access to the database here, so we reconstruct the user from the token
          user = {
            id: decoded.id,
            uuid: decoded.uuid,
            email: decoded.email,
            role: decoded.role,
            user_type: decoded.userType,
            name: decoded.name || "",
            password_hash: null,
            company_name: decoded.companyName || null,
            phone: null,
            address: null,
            city: null,
            postal_code: null,
            status: decoded.status || "ACTIVE",
            email_verified: false,
            email_verified_at: null,
            npwp_verified: false,
            npwp_valid_until: null,
            balance: { toString: () => "0" } as any, // Placeholder for Decimal
            points: 0,
            last_login_at: null,
            last_login_ip: null,
            remember_token: null,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null,
          };
        } catch (error) {
          // Token invalid, continue with null user
        }
      }
    }

    if (!isAuthenticated(user)) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    return handler(request, user!); // Using non-null assertion since we checked isAuthenticated
  };
}

export function requireAdmin(handler: (req: NextRequest, user: User) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    // Get user from request headers first
    let user = getUserFromNextRequest(request);

    // If no user from headers, try to get from cookies
    if (!user || !user.id) {
      const token = request.cookies.get("auth_token")?.value;
      if (token) {
        try {
          const decoded = verifyToken(token);
          // We don't have access to the database here, so we reconstruct the user from the token
          user = {
            id: decoded.id,
            uuid: decoded.uuid,
            email: decoded.email,
            role: decoded.role,
            user_type: decoded.userType,
            name: decoded.name || "",
            password_hash: null,
            company_name: decoded.companyName || null,
            phone: null,
            address: null,
            city: null,
            postal_code: null,
            status: decoded.status || "ACTIVE",
            email_verified: false,
            email_verified_at: null,
            npwp_verified: false,
            npwp_valid_until: null,
            balance: { toString: () => "0" } as any, // Placeholder for Decimal
            points: 0,
            last_login_at: null,
            last_login_ip: null,
            remember_token: null,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null,
          };
        } catch (error) {
          // Token invalid, continue with null user
        }
      }
    }

    if (!isAuthenticated(user)) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!isAdmin(user!)) {
      // Using non-null assertion since we checked isAuthenticated
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    return handler(request, user!); // Using non-null assertion since we checked isAuthenticated
  };
}

import { Response, NextFunction } from "express";
import { Request } from "express";
import jwt from "jsonwebtoken";
import UserDTO from "../../shared/DTO/UserDTO";
import { JWTResponse } from "../../shared/DTO/ResponseDTO";

export interface AuthRequest extends Request {
    user?: UserDTO;
}

export function validateJWT(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ token: false, message: "No token" } as JWTResponse);
    }

    const token = authHeader.split(" ")[1] as string;

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY as string) as UserDTO;
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ token: false, message: "Invalid token" } as JWTResponse);
    }
}

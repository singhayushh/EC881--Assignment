import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const Auth = (allow: boolean = true) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.cookies["auth_token"]) {
                if (allow) next();
                else res.redirect("/sign-in");
            }
            const decoded: any = jwt.verify(
                req.cookies["auth_token"],
                String(process.env.JWT_SECRET)
            );
            if (!decoded.username) {
                if (allow) next();
                else res.redirect("/sign-in");
            } else {
                res.locals.user = decoded;
                next();
            }
        } catch (error) {
            res.redirect("/sign-in");
        }
    }
}

export { Auth };
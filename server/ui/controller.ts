import { Request, Response } from "express";
import { Create, FetchByEmail } from "../auth/service";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { UserDto } from "../auth/dto";
import { spawnSync } from "child_process";

const GetPrediction = async (req: Request, res: Response) => {
    try {
        const files: any = req.files;
        let predictionLeft = "", predictionRight = "";
        let script = spawnSync("python", ["scripts/predict.py", files.left_eye[0].path], { encoding: 'utf-8' })
        predictionLeft = script.stdout;
        script = spawnSync("python", ["scripts/predict.py", files.right_eye[0].path], { encoding: "utf-8" })
        predictionRight = script.stdout

        console.log(predictionLeft, predictionRight);

        return res.render("output", { user: res.locals.user, leftDRNumber: predictionLeft, rightDRNumber: predictionRight, leftEyePath: "/" + files.left_eye[0].filename, rightEyePath: "/" + files.right_eye[0].filename, page: "detect"});
    } catch (error) {
        console.log('error met');
        res.redirect("/predict");
    }
};

const RenderHome = async (req: Request, res: Response) => {
    return res.render("home", { user: res.locals.user, page: "home" });
};

const RenderAbout = async (req: Request, res: Response) => {
    return res.render("about", { user: res.locals.user, page: "about" });
};

const RenderPredict = async (req: Request, res: Response) => {
    return res.render("predict", { user: res.locals.user, page: "predict" });
};

const RenderTeam = async (req: Request, res: Response) => {
    return res.render("team", { user: res.locals.user, page: "team" });
};

const RenderAcknowledgement = async (req: Request, res: Response) => {
    return res.render("acknowledgement", { user: res.locals.user, page: "acknowledgement" });
};

const RenderSignIn = async (req: Request, res: Response) => {
    return res.render("sign-in", { user: res.locals.user, page: "sign-in" });
};

const RenderSignUp = async (req: Request, res: Response) => {
    return res.render("sign-up", { user: res.locals.user, page: "sign-up" });
};

const SignIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await FetchByEmail(email);
    if (!user) return res.redirect("/sign-in");
    const matchPassword = await compare(
        password,
        String(user.password)
    );
    if (!matchPassword) return res.redirect("/sign-in");

    const token = sign(
        user,
        String(process.env.JWT_SECRET)
    );

    res.cookie("auth_token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 24 * 8.64e7,
    });

    return res.redirect("/predict");
};

const SignOut = async (req: Request, res: Response) => {
    res.cookie("auth_token", null, {
        maxAge: 0,
        httpOnly: true,
        secure: false,
    });
    return res.redirect("/home");
};

const SignUp = async (req: Request, res: Response) => {
    const userDto: UserDto = { ...req.body };
    let user = await FetchByEmail(userDto.email);
    if (user) return res.redirect("/sign-up");
    
    user = await Create(userDto);

    const token = sign(
        user,
        String(process.env.JWT_SECRET)
    );

    res.cookie("auth_token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 24 * 8.64e7,
    });

    return res.redirect("/predict");
};


export {
    GetPrediction,
    RenderAbout,
    RenderAcknowledgement,
    RenderHome,
    RenderPredict,
    RenderSignIn,
    RenderSignUp,
    RenderTeam,
    SignIn,
    SignOut,
    SignUp,
}
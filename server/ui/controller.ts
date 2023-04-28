import { Request, Response } from "express";
import { Create, FetchByEmail } from "../auth/service";
import { Create as CreatePrediction, FetchAll, FetchById, FetchStats } from "../prediction/service";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { UserDto } from "../auth/dto";
import { spawnSync } from "child_process";
import { randomBytes } from "crypto";
import { PredictionDto } from "../prediction/dto";

const GetPrediction = async (req: Request, res: Response) => {
    try {
        const files: any = req.files;
        
        // start the timer to record time of execution
        const start = new Date().getTime();

        // run the prediction for left eye
        let script = spawnSync("python", ["scripts/predict.py", files.left_eye[0].path], { encoding: 'utf-8' })
        const predictionLeft = (script.stdout).split(/\r?\n/);
        
        // run the prediction for right eye
        script = spawnSync("python", ["scripts/predict.py", files.right_eye[0].path], { encoding: "utf-8" })
        const predictionRight = (script.stdout).split(/\r?\n/);

        // stop the timer to record time of execution
        const end = new Date().getTime();

        // create the data transfer object for saving to database
        const dto: PredictionDto = { ...req.body };
        dto.id = randomBytes(3).toString("hex");;
        dto.leftEyeDRLevel = Number(predictionLeft[1]);
        dto.rightEyeDRLevel = Number(predictionRight[1]);
        dto.leftEyePredictions = predictionLeft[2].replace(/^\[?|\]?$/g, "").trim().split(/\s+/).map(Number);
        dto.rightEyePredictions = predictionRight[2].replace(/^\[?|\]?$/g, "").trim().split(/\s+/).map(Number);
        dto.leftEyeImage = "/" + files.left_eye[0].filename;
        dto.rightEyeImage = "/" + files.right_eye[0].filename;
        dto.executionTime = end - start;

        // save prediction to database
        const prediction = await CreatePrediction(dto);

        return res.status(200).json({ path: `/result/${prediction.id}` });
    } catch (error) {
        console.log(error)
        return res.status(200).json({ path: `/result/error` });
    }
};

const RenderHome = async (req: Request, res: Response) => {
    return res.render("home", { user: res.locals.user, page: "home" });
};

const RenderAbout = async (req: Request, res: Response) => {
    return res.render("about", { user: res.locals.user, page: "about" });
};

const RenderPredict = async (req: Request, res: Response) => {
    return res.render("predict", { user: res.locals.user, prediction: {}, page: "predict" });
};

const RenderResults = async (req: Request, res: Response) => {
    const predictions = await FetchAll();
    const stats = FetchStats(predictions);
    return res.render("results", { page: "results", predictions, stats, user: res.locals.user });
}

const RenderResult = async (req: Request, res: Response) => {
    const prediction = await FetchById(req.params.id);
    const diseases = ["No Diabetic Retinopathy", "Mild Diabetic Retinopathy", "Moderate Diabetic Retinopathy", "Severe Diabetic Retinopathy", "Proliferative Diabetic Retinopathy"]
    return res.render("output", { user: res.locals.user, page: "predict", prediction, diseases });
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
    RenderResult,
    RenderResults,
    RenderSignIn,
    RenderSignUp,
    RenderTeam,
    SignIn,
    SignOut,
    SignUp,
}
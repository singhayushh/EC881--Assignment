import { Router } from "express";
import * as ui from "./controller";
import { upload } from "../config/multer";

const UIRouter: Router = Router();

UIRouter.get("/", ui.RenderHome);
UIRouter.get("/team", ui.RenderTeam);
UIRouter.get("/about", ui.RenderAbout);
UIRouter.get("/sign-in", ui.RenderSignIn);
UIRouter.get("/sign-up", ui.RenderSignUp);
UIRouter.get("/predict", ui.RenderPredict);
UIRouter.get("/results", ui.RenderResults);
UIRouter.get("/result/:id", ui.RenderResult);
UIRouter.get("/acknowledgements", ui.RenderAcknowledgement);

UIRouter.post("/predict", upload.fields([{ name: "left_eye", maxCount: 1 }, { name: "right_eye", maxCount: 1 }]) , ui.GetPrediction);

const AuthRouter: Router = Router();

AuthRouter.post("/sign-in", ui.SignIn);
AuthRouter.get("/sign-out", ui.SignOut);
AuthRouter.post("/sign-up", ui.SignUp);

export { AuthRouter, UIRouter };
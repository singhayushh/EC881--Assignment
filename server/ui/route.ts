import { Router } from "express";
import * as ui from "./controller";
import { upload } from "../config/multer";
import { Auth } from "../auth/middleware";

const UIRouter: Router = Router();

UIRouter.get("/", Auth(true), ui.RenderHome);
UIRouter.get("/team", Auth(true), ui.RenderTeam);
UIRouter.get("/about", Auth(true), ui.RenderAbout);
UIRouter.get("/sign-in", ui.RenderSignIn);
UIRouter.get("/sign-up", ui.RenderSignUp);
UIRouter.get("/predict", Auth(true), ui.RenderPredict);
UIRouter.get("/results", Auth(true), ui.RenderResults);
UIRouter.get("/result/:id", Auth(true), ui.RenderResult);
UIRouter.get("/acknowledgements", Auth(true), ui.RenderAcknowledgement);

UIRouter.post("/predict", upload.fields([{ name: "left_eye", maxCount: 1 }, { name: "right_eye", maxCount: 1 }]) , ui.GetPrediction);

const AuthRouter: Router = Router();

AuthRouter.post("/sign-in", ui.SignIn);
AuthRouter.get("/sign-out", ui.SignOut);
AuthRouter.post("/sign-up", ui.SignUp);

export { AuthRouter, UIRouter };
import { Request } from "express";
import multer from "multer";

const diskStorageOptions: multer.DiskStorageOptions = {
    destination: (_req: Request, _file: Express.Multer.File, cb) =>
        cb(null, "./uploads/"),
    filename: (_req: Request, file: Express.Multer.File, cb) =>
        cb(null, file.originalname.replace(/ /g, "-")),
};

const multerOptions: multer.Options = {
    storage: multer.diskStorage(diskStorageOptions)
};

const upload = multer(multerOptions);

export { upload };

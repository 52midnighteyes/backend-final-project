import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const MAX_SIZE = 5 * 1024 * 1024;

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg and .png files are allowed!"));
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});

export default upload;

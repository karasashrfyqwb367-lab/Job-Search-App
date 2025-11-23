import { diskStorage, FileFilterCallback } from "multer";
import { extname } from "path";
export const multerOptions = {
  storage: diskStorage({
    destination: "./src/uploads",
    filename(req, file, callback) {
      const uploadsufix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${file.originalname}-${uploadsufix}${ext}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!file.mimetype.startsWith("image/")) {
      // استخدم null و Error معاً بالطريقة الصح
      return cb(new Error("Only images are allowed!") as unknown as null, false);
    }
    cb(null, true);
  },
};


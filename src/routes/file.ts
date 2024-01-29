import express, { Request } from "express";
const router = express.Router();
import multer from "multer";

const base = "http://localhost:3000/";

declare global {
  namespace Express {
    interface Request {
      file: multer.File;
    }
  }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')
            .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
            .slice(1)
            .join('.')
        cb(null, Date.now() + "." + ext)
    }
})
const upload = multer({ storage: storage });
/**
* @swagger
* tags:
*   name: File
*   description: The Files API
*/

/**
* @swagger
* /file:
*   post:
*     summary: upload a file
*     tags: [File]
*     consumes:
*       - multipart/form-data
*     parameters:
*       - in: formData
*         name: file
*         schema:
*           type: file
*         description: The file to upload
*     responses:
*       '200':
*         description: 'File uploaded successfully'
*       '400':
*         description: 'Bad request. Invalid input.'
*       '500':
*         description: 'Internal server error'
*/
router.post('/', upload.single("file"), function (req, res) {
    res.status(200).send({ url: base + req.file.path })
});
export = router;
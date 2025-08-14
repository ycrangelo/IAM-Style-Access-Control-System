import { Router } from "express";
import { create, edit, get, remove } from "../../controller/user/userController.mjs";

const router = Router()

// // secured route bellow
// router.use(authenticateJWT);

router.get("/get", get)
router.delete("/delete/:id", remove)
router.post("/post", create)
router.put("/edit/:id", edit)

export default router;
import { Router } from "express";
import { create, edit, get, remove, asignUserGroup } from "../../controller/group/groupController.mjs";
import { authenticateJWT } from "../../middlewares/authenticateJWT.mjs";
const router = Router()

// // secured route bellow
 router.use(authenticateJWT);

router.get("/get", get)
router.delete("/delete/:id", remove)
router.post("/post", create)
router.put("/edit/:id", edit)
router.post("/:groupId/users", asignUserGroup)

export default router;
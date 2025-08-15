import { Router } from "express";
import { create, edit, get, remove, assignPermissionRole } from "../../controller/permission/permissionController.mjs";
import { authenticateJWT } from "../../middlewares/authenticateJWT.mjs";
const router = Router()

// // secured route bellow
 router.use(authenticateJWT);

router.get("/get", get)
router.delete("/delete/:id", remove)
router.post("/post", create)
router.put("/edit/:id", edit)
router.post("/:roleId/permissions", assignPermissionRole)

export default router;
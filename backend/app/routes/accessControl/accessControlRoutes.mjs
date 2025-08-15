import { Router } from "express";
import { authenticateJWT } from "../../middlewares/authenticateJWT.mjs";
import { simulateAction, getMyPermissions } from "../../controller/accessControl/accessController.mjs";
const router = Router()

// // secured route bellow
 router.use(authenticateJWT);

router.get("/me/getMyPermissions", getMyPermissions)
router.post("/simulate-action", simulateAction)

export default router;
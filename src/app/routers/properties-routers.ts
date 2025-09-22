import { Router } from "express";
import { propertiesController } from "../controllers/properties-controller";

const router = Router();

router.get("/", propertiesController.getAll);
router.get("/:slug", propertiesController.getDetail);

export default router;

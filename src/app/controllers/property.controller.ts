import { Request, Response, NextFunction } from "express";
import { getPropertyService } from "../services/property.services";

export async function getPropertyController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { property_id } = req.params;
    console.log(property_id);
    const response = await getPropertyService(property_id);

    res.status(200).json({
      message: "data found",
      data: response,
    });
  } catch (err) {
    next(err);
  }
}

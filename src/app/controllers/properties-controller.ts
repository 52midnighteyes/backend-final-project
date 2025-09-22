import { Request, Response } from "express";
import { propertiesService } from "../services/properties.services";

export const propertiesController = {
  async getAll(req: Request, res: Response) {
    try {
      const data = await propertiesService.getAll({
        city: typeof req.query.city === "string" ? req.query.city : undefined,
        category:
          typeof req.query.category === "string"
            ? req.query.category
            : undefined,
        facilities:
          typeof req.query.facilities === "string"
            ? (req.query.facilities as string).split(",").map((s) => s.trim())
            : undefined,
        minPrice:
          typeof req.query.minPrice === "string"
            ? Number(req.query.minPrice)
            : undefined,
        maxPrice:
          typeof req.query.maxPrice === "string"
            ? Number(req.query.maxPrice)
            : undefined,
        guests:
          typeof req.query.guests === "string"
            ? Number(req.query.guests)
            : undefined,
        startDate:
          typeof req.query.startDate === "string"
            ? req.query.startDate
            : undefined,
        endDate:
          typeof req.query.endDate === "string" ? req.query.endDate : undefined,
        sort:
          typeof req.query.sort === "string" &&
          ["price_asc", "price_desc", "rating_desc"].includes(req.query.sort)
            ? (req.query.sort as "price_asc" | "price_desc" | "rating_desc")
            : undefined,
        take:
          typeof req.query.take === "string"
            ? Number(req.query.take)
            : undefined,
        skip:
          typeof req.query.skip === "string"
            ? Number(req.query.skip)
            : undefined,
      });

      return res.json({
        success: true,
        items: data.items, 
        total: data.total,
      });
    } catch (err: any) {
      console.error("[PropertiesController:getAll] error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch properties",
      });
    }
  },

  async getDetail(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      if (!slug) {
        return res.status(400).json({
          success: false,
          message: "Slug parameter is required",
        });
      }

      const data = await propertiesService.getDetail(slug);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      return res.json({ success: true, data });
    } catch (err: any) {
      console.error("[PropertiesController:getDetail] error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch detail",
      });
    }
  },
};

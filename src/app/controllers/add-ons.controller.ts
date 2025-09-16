import { Response, Request, NextFunction } from "express";
import {
  CreateAddOnService,
  GetAllAddOnService,
} from "../services/add-ons-services";
import {
  ICreateAddOnsParams,
  IGetAllAddOnsParams,
} from "../Interfaces/add-ons.interface";

export async function CreateAddOnController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body;
    const user = req.user?.id;
    const response = await CreateAddOnService({
      ...data,
      owner_id: user,
    } as ICreateAddOnsParams);

    res.status(201).json({
      message: "Add On Successfully Created",
      data: response,
    });
  } catch (err) {
    next(err);
  }
}

export async function GetAllAddOnController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const user = req.user?.id;
    const response = await GetAllAddOnService({
      property_id: id,
      owner_id: user,
    } as IGetAllAddOnsParams);

    res.status(200).json({
      message: "OK",
      data: response,
    });
  } catch (err) {
    next(err);
  }
}

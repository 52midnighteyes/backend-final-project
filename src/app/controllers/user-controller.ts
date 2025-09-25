import { Request, Response, NextFunction } from "express";
import {
  getUserProfileService,
  updateUserProfileService,
  resendVerifyEmailService,
  confirmVerifyEmailService,
} from "../services/user.services";
import {
  IUpdateUserProfileParams,
  IConfirmVerifyEmailParams,
} from "../interfaces/user.types";
import { AppError } from "../classes/appError.class";

// GET /user/profile
export async function getUserProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }
    const userId: string = req.user.id;
    const user = await getUserProfileService(userId);
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

// PATCH /user/profile
export async function updateUserProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }
    const userId: string = req.user.id;
    const params: IUpdateUserProfileParams = req.body;
    const updated = await updateUserProfileService(userId, params);
    res.status(200).json({ message: "Profile updated", data: updated });
  } catch (err) {
    next(err);
  }
}

// POST /user/verify-email
export async function resendVerifyEmailController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }
    const userId: string = req.user.id;
    const response = await resendVerifyEmailService(userId);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

// GET /user/verify-email/confirm
export async function confirmVerifyEmailController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params: IConfirmVerifyEmailParams = {
      token: req.query.token as string,
    };
    const message = await confirmVerifyEmailService(params);
    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}

// // POST /api/user/change-password
// export const changePassword = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user.id; 
//     const { oldPassword, newPassword } = req.body;

//     const user = await db.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isValid = await bcrypt.compare(oldPassword, user.password);
//     if (!isValid) {
//       return res.status(400).json({ message: "Password lama salah" });
//     }

//     const hashed = await bcrypt.hash(newPassword, 10);
//     await db.user.update({
//       where: { id: userId },
//       data: { password: hashed },
//     });

//     return res.json({ message: "Password berhasil diubah" });
//   } catch (err) {
//     return res.status(500).json({ message: "Gagal mengubah password" });
//   }
// };

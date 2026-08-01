import { Request, Response } from "express";
import { UserService } from "../services/user.service.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  getMe = async (req: Request, res: Response) => {
    const user = await this.userService.getProfile(req.user.userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  };
}

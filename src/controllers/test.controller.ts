// import { Request, Response, NextFunction } from "express";

// interface AuthRequest extends Request {
//   user: { id: string; email: string };
// }

// export const test = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     return res.status(200).json({
//       message: "works",
//       user: req.user,
//     });
//   } catch (e) {
//     return res.status(400).json({
//       error: "mware not working",
//     });
//   }
// };

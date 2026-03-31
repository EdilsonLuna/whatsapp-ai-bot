import { payloadTokenUser } from "../modules/Auth/Models/auth.model";

declare global {
  namespace Express {
    interface Request {
      user?: payloadTokenUser;
    }
  }
}

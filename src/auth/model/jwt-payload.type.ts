import { UserRole } from './user-role.enum';

export type JwtPayload = {
  userId: string;
  role: UserRole;
};

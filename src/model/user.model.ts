export class RegisterUserRequest {
  username: string;
  password: string;
  name: string;
}

export class LoginUserRequest {
  username: string;
  password: string;
}

export class RefreshTokenUserRequest {
  refreshToken: string;
}

export class UpdateUserRequest {
  name?: string;
  password?: string;
}

export class UserResponse {
  id?: string;
  username: string;
  name: string;
  accessToken?: string;
  refreshToken?: string;
}

 
export class VerifyOtpDto {
    constructor(
      public readonly email: string,
      public readonly otp: string,
    ) {}
  }
  
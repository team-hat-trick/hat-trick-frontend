import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(2, "이름을 2자 이상 입력해주세요."),
    email: z.string().email("올바른 이메일 형식이 아닙니다."),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    passwordConfirm: z.string().min(8, "비밀번호 확인을 입력해주세요."),
    verificationCode: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export type SignupSchema = z.infer<typeof signupSchema>;

import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address")
        .min(1, "Email is required"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be less than 12 characters")
        .min(1, "Password is required"),
});

export const signupSchema = z
    .object({
        collegeName: z
            .string()
            .min(3, "College name must be at least 3 characters")
            .max(100, "College name should not exceed 100 characters"),
        phone: z
            .string()
            .regex(
                /^\d{10,15}$/,
                "Phone number must be between 10 to 15 digits"
            ),
        email: z.string().email("Invalid email address"),
        otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit number"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z
            .string()
            .min(8, "Password must be atleast 8 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const resetPasswordSchema = z
    .object({
        email: z.string().email("Invalid email address"),
        otp: z
            .string()
            .length(6, "OTP must be 6 digits")
            .regex(/^\d{6}$/, "OTP must be numeric"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"], // Error will show under `confirmPassword` field
    });

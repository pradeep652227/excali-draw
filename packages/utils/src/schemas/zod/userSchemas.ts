import z from "zod";

export const CreateUserSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8).max(100),
}).superRefine(({ password }, checkPassComplexity) => {
    const containsUpper = (ch: string) => /[A-Z]/.test(ch);
    const containsLower = (ch: string) => /[a-z]/.test(ch);
    const containsSpecial = (ch: string) => /[!@#$%^&*(),.?":{}|<>]/.test(ch);

    let countUpper = 0, countLower = 0, countSpecial = 0, countNums = 0;
    for (const ch of password) {
        if (containsUpper(ch)) countUpper++;
        else if (containsLower(ch)) countLower++;
        else if (containsSpecial(ch)) countSpecial++;
        else if (!isNaN(+(ch))) countNums++;
    }

    const errorObj: any = {};
    if (!countUpper) errorObj["upper"] = "Password must contain at least one uppercase letter";
    if (!countLower) errorObj["lower"] = "Password must contain at least one lowercase letter";
    if (!countSpecial) errorObj["special"] = "Password must contain at least one special character";
    if (!countNums) errorObj["number"] = "Password must contain at least one number";

    // let message = (Object.values(errorObj) as [string]).reduce((acc: string, msg: string) => acc + msg + " | ", "");
    let message = (Object.values(errorObj) as [string]).join(" | ");
    if (Object.keys(errorObj).length)
        checkPassComplexity.addIssue({
            code: "custom",
            path: ["password"],
            message: message
        });
});

export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
});

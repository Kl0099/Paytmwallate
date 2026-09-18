"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { validateAmount } from "./validation";


export const createOnRempTransaction = async (
  amount: number,
  Provider: any
) => {
  const session = await getServerSession(authOptions);
  //@ts-ignore
  const userId = session?.user?.id;
  if (!userId) {
    return {
      success: false,
      message: "User Not Logged in",
    };
  }

  const validated = validateAmount(amount);
  if (!validated.success) {
    return {
      success: false,
      message: validated.message,
    };
  }
  amount = validated.amount;

  try {
    await prisma.onRampTransaction.create({
      data: {
        token: token,
        amount: amount,
        //@ts-ignore
        userId: Number(session.user.id),
        startTime: new Date(),
        provider: Provider,
        status: "Processing",
      },
    });

    return {
      success: true,
      message: "on Ramp Transaction Successful",
      bankdetail: {
        userId: userId,
        token: token,
        amount: amount,
        provider: Provider,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "error while creating Ramp Transaction",
    };
  }
};

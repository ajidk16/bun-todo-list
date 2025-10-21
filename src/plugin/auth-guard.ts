export const authGuard = {
  beforeHandle: [
    async ({ jwt, bearer, status }: any) => {
      const token = await jwt.verify(bearer);
      // console.log("Verified Token:", token);
      if (!token) return status(401, { error: "Unauthorized" });
    },
  ],
};

import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const courseRouter = createTRPCRouter({
  getCourses: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.course.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  createCourse: protectedProcedure
    .input(z.object({ title: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const newCourse = await ctx.prisma.course.create({
        data: {
          title: input.title,
          description: input.description,
          userId: userId,
        },
      });
      return newCourse;
    }),
});

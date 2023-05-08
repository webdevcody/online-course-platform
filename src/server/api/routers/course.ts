import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_MAX_FILE_SIZE = 1000000;

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: "http://localhost:5000",
  forcePathStyle: true,
  credentials: {
    accessKeyId: "S3RVER",
    secretAccessKey: "S3RVER",
  },
});

export const courseRouter = createTRPCRouter({
  getCourseById: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
      });
    }),
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
  updateCourse: protectedProcedure
    .input(z.object({ title: z.string(), courseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      await ctx.prisma.course.updateMany({
        where: {
          id: input.courseId,
          userId,
        },
        data: {
          title: input.title,
        },
      });
      return { status: "updated" };
    }),
  createPresignedUrl: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // const userId = ctx.session.user.id;
      const course = await ctx.prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "the course does not exist",
        });
      }

      const imageId = uuidv4();
      await ctx.prisma.course.update({
        where: {
          id: course.id,
        },
        data: {
          imageId,
        },
      });

      return createPresignedPost(s3Client, {
        Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
        Key: imageId,
        Fields: {
          key: imageId,
        },
        Conditions: [
          ["starts-with", "$Content-Type", "image/"],
          ["content-length-range", 0, UPLOAD_MAX_FILE_SIZE],
        ],
      });
    }),
});

import { z } from 'zod';

import { ResultFns } from '@/errors/Result';
import { useZodSchema } from '@/hooks/useZodSchema';
import { SongRepo } from '@/repo/song.repo';
import { AuthService, type AuthorizedHandler } from '@/services/auth.service';
import { StorageService } from '@/services/storage.service';

const AddSongSchema = z.object({
  name: z.string().min(1),
  file: z.instanceof(File),
  image: z.instanceof(File),
  duration: z
    .string()
    .refine((val) => {
      if (isNaN(Number(val))) {
        return false;
      }
      return true;
    })
    .transform((val) => Number(val)),
});
const AddSongHandler: AuthorizedHandler = async (req) => {
  const body = await useZodSchema(AddSongSchema);
  const fileUploadResult = await StorageService.upload(body.name, body.file);
  if (!fileUploadResult.success) {
    return Response.json(fileUploadResult.error, {
      status: fileUploadResult.error.status,
    });
  }

  const imageUploadResult = await StorageService.upload(body.name, body.image);
  if (!imageUploadResult.success) {
    return Response.json(imageUploadResult.error, {
      status: imageUploadResult.error.status,
    });
  }

  const result = await SongRepo.create({
    name: body.name,
    url: fileUploadResult.value,
    image: imageUploadResult.value,
    duration: body.duration,
    size: body.file.size,
  });

  return ResultFns.match(result)({
    Ok(value) {
      return Response.json(value, { status: 201 });
    },
    Err(error) {
      return Response.json(error, { status: error.status });
    },
  });
};

export default AuthService.authorizeHandler(AddSongHandler, 'admin');

import type { RequestHandler } from 'buniverse';
import { ResultFns } from '../../errors/Result';
import { SongRepo } from '../../repo/song.repo';

const GetSongsHandler: RequestHandler = async (req) => {
  const result = await SongRepo.getMany();
  return ResultFns.match(result)({
    Ok(value) {
      return Response.json(value, { status: 200 });
    },
    Err(error) {
      return Response.json(error, { status: error.status });
    },
  });
};

export default GetSongsHandler;

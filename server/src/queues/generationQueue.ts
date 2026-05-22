import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const generationQueue = new Queue('generation-queue', {
  connection: redisConnection,
});

export const addGenerationJob = async (assignmentId: string) => {
  await generationQueue.add('generate-paper', { assignmentId }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  });
};

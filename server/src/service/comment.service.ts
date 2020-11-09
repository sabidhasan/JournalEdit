import { getRepository } from 'typeorm'
import { getManager } from 'typeorm';
import { Comment } from '../entity/comment.entity';

export const findCommentsForJob = async (jobId: number): Promise<Comment[]> => {
  return await getRepository(Comment)
    .createQueryBuilder('comment')
    .leftJoin('comment.job', 'job')
    .leftJoinAndSelect('comment.user', 'users')
    .where('job.deleted = false')
    .andWhere('job.id = :jobId', { jobId, })
    .orderBy({ 'comment.created': 'DESC' })
    .getMany();
};

export const createComment = async (newComment: Comment) => {
  const commentRepository = getRepository(Comment);

  try {
    await commentRepository.save(commentRepository.create(newComment));
    return await getManager().findOne(Comment, newComment.id);
  } catch (error) {
    throw new Error(error);
  }
};

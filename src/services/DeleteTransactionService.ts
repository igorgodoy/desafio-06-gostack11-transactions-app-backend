import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    if (!id) {
      throw new AppError(
        'Unable to remove transaction. Check your sent fields.',
      );
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const checkTransactionExists = await transactionsRepository.findOne(id);

    if (!checkTransactionExists) {
      throw new AppError('Missing transaction requested.', 404);
    }

    try {
      await transactionsRepository.delete({ id });
    } catch (err) {
      console.log(err);
      throw new AppError('Unable to to remove transaction');
    }
  }
}

export default DeleteTransactionService;

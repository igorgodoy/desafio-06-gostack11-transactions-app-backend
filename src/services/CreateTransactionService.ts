import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (!title || !value || !type || !category) {
      throw new AppError(
        'Unable to create a new transaction. Check you sent fields',
      );
    }

    let category_id = '';
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError(
        "You can't create an outcome transaction without a valid valid balance",
      );
    }

    const categoryRepository = getRepository(Category);

    let categoryRequest = await categoryRepository.findOne({
      title: category,
    });

    if (!categoryRequest) {
      categoryRequest = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(categoryRequest);
    }

    category_id = categoryRequest.id;

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

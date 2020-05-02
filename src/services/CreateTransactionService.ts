import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    let newCategory: Category | null = null;
    const findCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!findCategory) {
      newCategory = categoryRepository.create({ title: category });

      await categoryRepository.save(newCategory);
    }

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();

      if (value > balance.total) {
        throw new AppError(
          'Invalid outcome value. Outcome value can not be grater then total balance value',
        );
      }
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: newCategory ? newCategory.id : findCategory?.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

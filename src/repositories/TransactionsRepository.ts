import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    let totalIncome = 0;
    let totalOutcome = 0;
    let total = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += Number(transaction.value);
      } else {
        totalOutcome += Number(transaction.value);
      }
    });

    total = totalIncome - totalOutcome;

    const balance: Balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;

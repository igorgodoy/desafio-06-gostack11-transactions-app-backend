import fs from 'fs';
import path from 'path';
import csv from 'csvtojson';
import UploadConfig from '../config/upload';

import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';

interface Request {
  importFilename: string;
}

class ImportTransactionsService {
  async execute({ importFilename }: Request): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();

    const csvFile = path.join(UploadConfig.directory, importFilename);

    const transactionsObj = await csv().fromFile(csvFile);

    const transactions: Transaction[] = [];

    for (const data of transactionsObj) {
      const transaction = await createTransactionService.execute(data);

      transactions.push(transaction);
    }

    await fs.promises.unlink(csvFile);

    return transactions;
  }
}

export default ImportTransactionsService;

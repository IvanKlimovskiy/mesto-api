import { INCORRECT_DATA_CODE } from '../constants';

class IncorrectData extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = INCORRECT_DATA_CODE;
  }
}

export default IncorrectData;

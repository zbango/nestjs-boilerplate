import * as moment from 'moment';
export function isValidDate(date: string) {
  return moment(date, 'DD/MM/YYYY', true).isValid();
}

import moment from 'moment';
export default function useMoment() {
  return {
    moment,
    datetime: (date: Date) => date && moment(date).format('YYYY-MM-DD HH:mm:ss'),
    datetime_m: (date: Date) => date && moment(date).format('YYYY-MM-DD HH:mm'),
    date: (date: Date) => date && moment(date).format('YYYY-MM-DD'),
  };
}

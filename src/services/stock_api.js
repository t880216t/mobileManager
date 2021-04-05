import request from '@/utils/request';

export async function queryStockEvents(params) {
  return request(`/api/base/getStockEvents?year=${params.year}&month=${params.month}&day=${params.day}&eventType=${params.eventType}`);
}

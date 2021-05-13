// 分页返回数据
export interface Page<T> {
  total: number;
  current: number;
  size: number;
  list: T[];
}

// 分页 + 获奖得分数据
export interface AwardPointPage<T> {
  totalScore: number;
  scores: Page<T>;
}


export type SortKey = 'name' | 'email' | 'role' | 'status' | 'lastLogin';

export interface SortConfig {
  key: SortKey;
  direction: 'asc' | 'desc';
}

export declare function request(
  endpoint: string,
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  body?: BodyInit | null
): Promise<Response>;

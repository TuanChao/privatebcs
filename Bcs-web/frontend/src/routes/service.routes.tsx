import { stringify } from "query-string/base";
import { generatePath, Params } from "react-router-dom";

/**
 * routeTo('admin/view/:id', { id: 'ok'}, { anotherParam: 'value' })
 * @param path 'admin/view/:id'
 * @param params { id: 'ok'}
 * @param query { anotherParam: 'value' }
 * @returns `/admin/view/ok?anotherParam=value`
 */

type ArrayFormat =
  | "bracket"
  | "index"
  | "comma"
  | "separator"
  | "bracket-separator"
  | "colon-list-separator"
  | "none"
  | undefined;
export const routeTo = (path: string, params?: Params, query?: object, arrayFormat?: ArrayFormat) => {
  const url = generatePath(path, params);

  return query ? `${url}?${stringify(query, arrayFormat ? { arrayFormat } : undefined)}` : url;
};

import { Recordable } from '../types/axios';
export declare function joinTimestamp<T extends boolean>(join: boolean, restful: T): T extends true ? string : object;
/**
 * @description: Format request parameter time
 */
export declare function formatRequestDate(params: Recordable): void;
//# sourceMappingURL=helper.d.ts.map
import { STATUS, TAX_TYPE } from '../constant/constant';

export type TStatus = keyof typeof STATUS;
export type TTaxType = (typeof TAX_TYPE)[number];

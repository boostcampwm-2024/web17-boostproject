/* eslint-disable @typescript-eslint/no-explicit-any */

export type MinuteData = {
  stck_bsop_date: string;
  stck_cntg_hour: string;
  stck_prpr: string;
  stck_oprc: string;
  stck_hgpr: string;
  stck_lwpr: string;
  cntg_vol: string;
  acml_tr_pbmn: string;
};

export type UpdateStockQuery = {
  fid_etc_cls_code: string;
  fid_cond_mrkt_div_code: 'J' | 'W';
  fid_input_iscd: string;
  fid_input_hour_1: string;
  fid_pw_data_incu_yn: 'Y' | 'N';
};

export const isMinuteData = (data: any) => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.stck_bsop_date === 'string' &&
    typeof data.stck_cntg_hour === 'string' &&
    typeof data.stck_prpr === 'string' &&
    typeof data.stck_oprc === 'string' &&
    typeof data.stck_hgpr === 'string' &&
    typeof data.stck_lwpr === 'string' &&
    typeof data.cntg_vol === 'string' &&
    typeof data.acml_tr_pbmn === 'string'
  );
};

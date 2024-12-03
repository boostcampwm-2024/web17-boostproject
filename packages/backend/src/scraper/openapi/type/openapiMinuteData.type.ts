/* eslint-disable @typescript-eslint/no-explicit-any */

export type MinuteDataOutput1 = {
  prdy_vrss: string;
  prdy_vrss_sign: string;
  prdy_ctrt: string;
  stck_prdy_clpr: string;
  acml_vol: string;
  acml_tr_pbmn: string;
  hts_kor_isnm: string;
  stck_prpr: string;
};

export type MinuteDataOutput2 = {
  stck_bsop_date: string;
  stck_cntg_hour: string;
  acml_tr_pbmn: string;
  stck_prpr: string;
  stck_oprc: string;
  stck_hgpr: string;
  stck_lwpr: string;
  cntg_vol: string;
};

export type MinuteData = {
  stck_bsop_date: string;
  stck_cntg_hour: string;
  acml_tr_pbmn: string;
  acml_vol: string;
  stck_prpr: string;
  stck_oprc: string;
  stck_hgpr: string;
  stck_lwpr: string;
  cntg_vol: string;
};

export const isMinuteDataOutput1 = (data: any): data is MinuteDataOutput1 => {
  return (
    data !== null &&
    typeof data === 'object' &&
    typeof data.prdy_vrss === 'string' &&
    typeof data.prdy_vrss_sign === 'string' &&
    typeof data.prdy_ctrt === 'string' &&
    typeof data.stck_prdy_clpr === 'string' &&
    typeof data.acml_vol === 'string' &&
    typeof data.acml_tr_pbmn === 'string' &&
    typeof data.hts_kor_isnm === 'string' &&
    typeof data.stck_prpr === 'string'
  );
};

export const isMinuteDataOutput2 = (data: any): data is MinuteDataOutput2 => {
  return (
    data !== null &&
    typeof data === 'object' &&
    typeof data.stck_bsop_date === 'string' &&
    typeof data.stck_cntg_hour === 'string' &&
    typeof data.acml_tr_pbmn === 'string' &&
    typeof data.stck_prpr === 'string' &&
    typeof data.stck_oprc === 'string' &&
    typeof data.stck_hgpr === 'string' &&
    typeof data.stck_lwpr === 'string' &&
    typeof data.cntg_vol === 'string'
  );
};

export type UpdateStockQuery = {
  fid_etc_cls_code: string;
  fid_cond_mrkt_div_code: 'J' | 'W';
  fid_input_iscd: string;
  fid_input_hour_1: string;
  fid_pw_data_incu_yn: 'Y' | 'N';
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Period = 'D' | 'W' | 'M' | 'Y';
export type ChartData = {
  stck_bsop_date: string;
  stck_clpr: string;
  stck_oprc: string;
  stck_hgpr: string;
  stck_lwpr: string;
  acml_vol: string;
  acml_tr_pbmn: string;
  flng_cls_code: string;
  prtt_rate: string;
  mod_yn: string;
  prdy_vrss_sign: string;
  prdy_vrss: string;
  revl_issu_reas: string;
};

export type ItemChartPriceQuery = {
  fid_cond_mrkt_div_code: 'J' | 'W';
  fid_input_iscd: string;
  fid_input_date_1: string;
  fid_input_date_2: string;
  fid_period_div_code: Period;
  fid_org_adj_prc: number;
};

export const isChartData = (data?: any) => {
  return (
    data &&
    typeof data.stck_bsop_date === 'string' &&
    typeof data.stck_clpr === 'string' &&
    typeof data.stck_oprc === 'string' &&
    typeof data.stck_hgpr === 'string' &&
    typeof data.stck_lwpr === 'string' &&
    typeof data.acml_vol === 'string' &&
    typeof data.acml_tr_pbmn === 'string' &&
    typeof data.flng_cls_code === 'string' &&
    typeof data.prtt_rate === 'string' &&
    typeof data.mod_yn === 'string' &&
    typeof data.prdy_vrss_sign === 'string' &&
    typeof data.prdy_vrss === 'string' &&
    typeof data.revl_issu_reas === 'string'
  );
};

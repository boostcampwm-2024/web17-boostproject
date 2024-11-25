/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines-per-function */

export type StockData = {
  MKSC_SHRN_ISCD: string; // 유가증권 단축 종목코드
  STCK_CNTG_HOUR: string; // 주식 체결 시간
  STCK_PRPR: string; // 주식 현재가
  PRDY_VRSS_SIGN: string; // 전일 대비 부호
  PRDY_VRSS: string; // 전일 대비
  PRDY_CTRT: string; // 전일 대비율
  WGHN_AVRG_STCK_PRC: string; // 가중 평균 주식 가격
  STCK_OPRC: string; // 주식 시가
  STCK_HGPR: string; // 주식 최고가
  STCK_LWPR: string; // 주식 최저가
  ASKP1: string; // 매도호가1
  BIDP1: string; // 매수호가1
  CNTG_VOL: string; // 체결 거래량
  ACML_VOL: string; // 누적 거래량
  ACML_TR_PBMN: string; // 누적 거래 대금
  SELN_CNTG_CSNU: string; // 매도 체결 건수
  SHNU_CNTG_CSNU: string; // 매수 체결 건수
  NTBY_CNTG_CSNU: string; // 순매수 체결 건수
  CTTR: string; // 체결강도
  SELN_CNTG_SMTN: string; // 총 매도 수량
  SHNU_CNTG_SMTN: string; // 총 매수 수량
  CCLD_DVSN: string; // 체결구분
  SHNU_RATE: string; // 매수비율
  PRDY_VOL_VRSS_ACML_VOL_RATE: string; // 전일 거래량 대비 등락율
  OPRC_HOUR: string; // 시가 시간
  OPRC_VRSS_PRPR_SIGN: string; // 시가대비구분
  OPRC_VRSS_PRPR: string; // 시가대비
  HGPR_HOUR: string; // 최고가 시간
  HGPR_VRSS_PRPR_SIGN: string; // 고가대비구분
  HGPR_VRSS_PRPR: string; // 고가대비
  LWPR_HOUR: string; // 최저가 시간
  LWPR_VRSS_PRPR_SIGN: string; // 저가대비구분
  LWPR_VRSS_PRPR: string; // 저가대비
  BSOP_DATE: string; // 영업 일자
  NEW_MKOP_CLS_CODE: string; // 신 장운영 구분 코드
  TRHT_YN: string; // 거래정지 여부
  ASKP_RSQN1: string; // 매도호가 잔량1
  BIDP_RSQN1: string; // 매수호가 잔량1
  TOTAL_ASKP_RSQN: string; // 총 매도호가 잔량
  TOTAL_BIDP_RSQN: string; // 총 매수호가 잔량
  VOL_TNRT: string; // 거래량 회전율
  PRDY_SMNS_HOUR_ACML_VOL: string; // 전일 동시간 누적 거래량
  PRDY_SMNS_HOUR_ACML_VOL_RATE: string; // 전일 동시간 누적 거래량 비율
  HOUR_CLS_CODE: string; // 시간 구분 코드
  MRKT_TRTM_CLS_CODE: string; // 임의종료구분코드
  VI_STND_PRC: string; // 정적VI발동기준가
};

export type OpenApiMessage = {
  header: {
    approval_key: string;
    custtype: string;
    tr_type: string;
    'content-type': string;
  };
  body: {
    input: {
      tr_id: string;
      tr_key: string;
    };
  };
};

export type MessageResponse = {
  header: {
    tr_id: string;
    tr_key: string;
    encrypt: string;
  };
  body: {
    rt_cd: string;
    msg_cd: string;
    msg1: string;
    output?: {
      iv: string;
      key: string;
    };
  };
};

export function isMessageResponse(data: any): data is MessageResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.header === 'object' &&
    data.header !== null &&
    typeof data.header.tr_id === 'object' &&
    typeof data.header.tr_key === 'object' &&
    typeof data.header.encrypt === 'object' &&
    typeof data.body === 'object' &&
    data.body !== null &&
    typeof data.body.rt_cd === 'object' &&
    typeof data.body.msg_cd === 'object' &&
    typeof data.body.msg1 === 'object' &&
    typeof data.body.output === 'object'
  );
}

export const stockDataKeys = [
  'MKSC_SHRN_ISCD',
  'STCK_CNTG_HOUR',
  'STCK_PRPR',
  'PRDY_VRSS_SIGN',
  'PRDY_VRSS',
  'PRDY_CTRT',
  'WGHN_AVRG_STCK_PRC',
  'STCK_OPRC',
  'STCK_HGPR',
  'STCK_LWPR',
  'ASKP1',
  'BIDP1',
  'CNTG_VOL',
  'ACML_VOL',
  'ACML_TR_PBMN',
  'SELN_CNTG_CSNU',
  'SHNU_CNTG_CSNU',
  'NTBY_CNTG_CSNU',
  'CTTR',
  'SELN_CNTG_SMTN',
  'SHNU_CNTG_SMTN',
  'CCLD_DVSN',
  'SHNU_RATE',
  'PRDY_VOL_VRSS_ACML_VOL_RATE',
  'OPRC_HOUR',
  'OPRC_VRSS_PRPR_SIGN',
  'OPRC_VRSS_PRPR',
  'HGPR_HOUR',
  'HGPR_VRSS_PRPR_SIGN',
  'HGPR_VRSS_PRPR',
  'LWPR_HOUR',
  'LWPR_VRSS_PRPR_SIGN',
  'LWPR_VRSS_PRPR',
  'BSOP_DATE',
  'NEW_MKOP_CLS_CODE',
  'TRHT_YN',
  'ASKP_RSQN1',
  'BIDP_RSQN1',
  'TOTAL_ASKP_RSQN',
  'TOTAL_BIDP_RSQN',
  'VOL_TNRT',
  'PRDY_SMNS_HOUR_ACML_VOL',
  'PRDY_SMNS_HOUR_ACML_VOL_RATE',
  'HOUR_CLS_CODE',
  'MRKT_TRTM_CLS_CODE',
  'VI_STND_PRC',
];

export type OpenapiLiveData = {
  iscd_stat_cls_code: string;
  marg_rate: string;
  rprs_mrkt_kor_name: string;
  bstp_kor_isnm: string;
  temp_stop_yn: string;
  oprc_rang_cont_yn: string;
  clpr_rang_cont_yn: string;
  crdt_able_yn: string;
  grmn_rate_cls_code: string;
  elw_pblc_yn: string;
  stck_prpr: string;
  prdy_vrss: string;
  prdy_vrss_sign: string;
  prdy_ctrt: string;
  acml_tr_pbmn: string;
  acml_vol: string;
  prdy_vrss_vol_rate: string;
  stck_oprc: string;
  stck_hgpr: string;
  stck_lwpr: string;
  stck_mxpr: string;
  stck_llam: string;
  stck_sdpr: string;
  wghn_avrg_stck_prc: string;
  hts_frgn_ehrt: string;
  frgn_ntby_qty: string;
  pgtr_ntby_qty: string;
  pvt_scnd_dmrs_prc: string;
  pvt_frst_dmrs_prc: string;
  pvt_pont_val: string;
  pvt_frst_dmsp_prc: string;
  pvt_scnd_dmsp_prc: string;
  dmrs_val: string;
  dmsp_val: string;
  cpfn: string;
  rstc_wdth_prc: string;
  stck_fcam: string;
  stck_sspr: string;
  aspr_unit: string;
  hts_deal_qty_unit_val: string;
  lstn_stcn: string;
  hts_avls: string;
  per: string;
  pbr: string;
  stac_month: string;
  vol_tnrt: string;
  eps: string;
  bps: string;
  d250_hgpr: string;
  d250_hgpr_date: string;
  d250_hgpr_vrss_prpr_rate: string;
  d250_lwpr: string;
  d250_lwpr_date: string;
  d250_lwpr_vrss_prpr_rate: string;
  stck_dryy_hgpr: string;
  dryy_hgpr_vrss_prpr_rate: string;
  dryy_hgpr_date: string;
  stck_dryy_lwpr: string;
  dryy_lwpr_vrss_prpr_rate: string;
  dryy_lwpr_date: string;
  w52_hgpr: string;
  w52_hgpr_vrss_prpr_ctrt: string;
  w52_hgpr_date: string;
  w52_lwpr: string;
  w52_lwpr_vrss_prpr_ctrt: string;
  w52_lwpr_date: string;
  whol_loan_rmnd_rate: string;
  ssts_yn: string;
  stck_shrn_iscd: string;
  fcam_cnnm: string;
  cpfn_cnnm: string;
  frgn_hldn_qty: string;
  vi_cls_code: string;
  ovtm_vi_cls_code: string;
  last_ssts_cntg_qty: string;
  invt_caful_yn: string;
  mrkt_warn_cls_code: string;
  short_over_yn: string;
  sltr_yn: string;
};

export const isOpenapiLiveData = (data: any): data is OpenapiLiveData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.iscd_stat_cls_code === 'string' &&
    typeof data.marg_rate === 'string' &&
    typeof data.rprs_mrkt_kor_name === 'string' &&
    typeof data.bstp_kor_isnm === 'string' &&
    typeof data.temp_stop_yn === 'string' &&
    typeof data.oprc_rang_cont_yn === 'string' &&
    typeof data.clpr_rang_cont_yn === 'string' &&
    typeof data.crdt_able_yn === 'string' &&
    typeof data.stck_prpr === 'string' &&
    typeof data.prdy_ctrt === 'string' &&
    typeof data.acml_vol === 'string' &&
    typeof data.stck_oprc === 'string' &&
    typeof data.stck_hgpr === 'string' &&
    typeof data.stck_lwpr === 'string' &&
    typeof data.wghn_avrg_stck_prc === 'string' &&
    typeof data.stck_shrn_iscd === 'string'
  );
};

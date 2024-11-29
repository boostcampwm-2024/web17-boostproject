/* eslint-disable @typescript-eslint/no-explicit-any*/
/* eslint-disable max-lines-per-function */

export type DetailData = {
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

export function isDetailData(data: any): data is DetailData {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.iscd_stat_cls_code === 'string' &&
    typeof data.marg_rate === 'string' &&
    typeof data.rprs_mrkt_kor_name === 'string' &&
    typeof data.bstp_kor_isnm === 'string' &&
    typeof data.temp_stop_yn === 'string' &&
    typeof data.oprc_rang_cont_yn === 'string' &&
    typeof data.clpr_rang_cont_yn === 'string' &&
    typeof data.crdt_able_yn === 'string' &&
    typeof data.grmn_rate_cls_code === 'string' &&
    typeof data.elw_pblc_yn === 'string' &&
    typeof data.stck_prpr === 'string' &&
    typeof data.prdy_vrss === 'string' &&
    typeof data.prdy_vrss_sign === 'string' &&
    typeof data.prdy_ctrt === 'string' &&
    typeof data.acml_tr_pbmn === 'string' &&
    typeof data.acml_vol === 'string' &&
    typeof data.prdy_vrss_vol_rate === 'string' &&
    typeof data.stck_oprc === 'string' &&
    typeof data.stck_hgpr === 'string' &&
    typeof data.stck_lwpr === 'string' &&
    typeof data.stck_mxpr === 'string' &&
    typeof data.stck_llam === 'string' &&
    typeof data.stck_sdpr === 'string' &&
    typeof data.wghn_avrg_stck_prc === 'string' &&
    typeof data.hts_frgn_ehrt === 'string' &&
    typeof data.frgn_ntby_qty === 'string' &&
    typeof data.pgtr_ntby_qty === 'string' &&
    typeof data.pvt_scnd_dmrs_prc === 'string' &&
    typeof data.pvt_frst_dmrs_prc === 'string' &&
    typeof data.pvt_pont_val === 'string' &&
    typeof data.pvt_frst_dmsp_prc === 'string' &&
    typeof data.pvt_scnd_dmsp_prc === 'string' &&
    typeof data.dmrs_val === 'string' &&
    typeof data.dmsp_val === 'string' &&
    typeof data.cpfn === 'string' &&
    typeof data.rstc_wdth_prc === 'string' &&
    typeof data.stck_fcam === 'string' &&
    typeof data.stck_sspr === 'string' &&
    typeof data.aspr_unit === 'string' &&
    typeof data.hts_deal_qty_unit_val === 'string' &&
    typeof data.lstn_stcn === 'string' &&
    typeof data.hts_avls === 'string' &&
    typeof data.per === 'string' &&
    typeof data.pbr === 'string' &&
    typeof data.stac_month === 'string' &&
    typeof data.vol_tnrt === 'string' &&
    typeof data.eps === 'string' &&
    typeof data.bps === 'string' &&
    typeof data.d250_hgpr === 'string' &&
    typeof data.d250_hgpr_date === 'string' &&
    typeof data.d250_hgpr_vrss_prpr_rate === 'string' &&
    typeof data.d250_lwpr === 'string' &&
    typeof data.d250_lwpr_date === 'string' &&
    typeof data.d250_lwpr_vrss_prpr_rate === 'string' &&
    typeof data.stck_dryy_hgpr === 'string' &&
    typeof data.dryy_hgpr_vrss_prpr_rate === 'string' &&
    typeof data.dryy_hgpr_date === 'string' &&
    typeof data.stck_dryy_lwpr === 'string' &&
    typeof data.dryy_lwpr_vrss_prpr_rate === 'string' &&
    typeof data.dryy_lwpr_date === 'string' &&
    typeof data.w52_hgpr === 'string' &&
    typeof data.w52_hgpr_vrss_prpr_ctrt === 'string' &&
    typeof data.w52_hgpr_date === 'string' &&
    typeof data.w52_lwpr === 'string' &&
    typeof data.w52_lwpr_vrss_prpr_ctrt === 'string' &&
    typeof data.w52_lwpr_date === 'string' &&
    typeof data.whol_loan_rmnd_rate === 'string' &&
    typeof data.ssts_yn === 'string' &&
    typeof data.stck_shrn_iscd === 'string' &&
    typeof data.fcam_cnnm === 'string' &&
    typeof data.cpfn_cnnm === 'string' &&
    typeof data.frgn_hldn_qty === 'string' &&
    typeof data.vi_cls_code === 'string' &&
    typeof data.ovtm_vi_cls_code === 'string' &&
    typeof data.last_ssts_cntg_qty === 'string' &&
    typeof data.invt_caful_yn === 'string' &&
    typeof data.mrkt_warn_cls_code === 'string' &&
    typeof data.short_over_yn === 'string' &&
    typeof data.sltr_yn === 'string'
  );
}

const BASE_QUERY = {
  fid_cond_mrkt_div_code: 'J',
  fid_cond_scr_div_code: '20170',
  fid_input_iscd: '0000',
  fid_input_cnt_1: '0',
  fid_input_price_1: '',
  fid_input_price_2: '',
  fid_vol_cnt: '',
  fid_trgt_cls_code: '0',
  fid_trgt_exls_cls_code: '0',
  fid_div_cls_code: '0',
  fid_rsfl_rate1: '',
  fid_rsfl_rate2: '',
};

export const DECREASE_STOCK_QUERY = {
  ...BASE_QUERY,
  fid_rank_sort_cls_code: '1',
  fid_prc_cls_code: '1',
};

export const INCREASE_STOCK_QUERY = {
  ...BASE_QUERY,
  fid_rank_sort_cls_code: '0',
  fid_prc_cls_code: '1',
};
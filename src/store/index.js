/* eslint-disable */
import { createStore } from 'vuex'
import chains from './chains';
import wallets from './wallets';
import transactions from './transactions';
import balances from './balances';
import allowances from './allowances';
import fees from './fees';
import health from './health';
import expecttime from './expecttime';
import listofnodes from './listofnodes';
import dashboard from './dashboard';
import overview from './overview';
import stakeamountinfo from './stakeamountinfo';
import nodedetail from './nodedetail';
import mynodes from './mynodes';


export default createStore({
  modules: {
    chains,
    wallets,
    transactions,
    balances,
    allowances,
    fees,
    health,
    expecttime,
    listofnodes,
    dashboard,
    overview,
    stakeamountinfo,
    nodedetail,
    mynodes
  },
});

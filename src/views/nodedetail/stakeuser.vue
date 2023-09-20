<template>
  <div class="stakeuser">
    <div class="title">Stake user rank</div>
    <div class="line"></div>
    <ElTable :data="StakeUserRank" style="width: 100%">
      <el-table-column prop="Rank" label="Amount" width="180">
      </el-table-column>
      <el-table-column prop="StakeAddress" label="StakeAddress">
        <template #default="scope">
          {{ formatLongText(scope.row.StakeAddress) }}
        </template>
      </el-table-column>
      <el-table-column prop="Amount" label="Amount">
        <template #default="scope">
          {{ integerToDecimal(scope.row.Amount) }}
        </template>
      </el-table-column>
      <el-table-column prop="TotalStake" label="%">
        <template #default="scope">
          {{ ((scope.row.Amount * 100) / scope.row.TotalStake).toFixed(2) }} %
        </template>
      </el-table-column>
    </ElTable>
  </div>
</template>

<script>
import format from '@/utils/formatters'
import { integerToDecimal } from '@/utils/convertors'
import { ElTable } from 'element-plus'
export default {
  name: 'NodeStakeUserView',
  props: { nodeDetail: Object },
  components: { ElTable },
  data() {
    return {
      userStakeVisible: false
    }
  },
  computed: {
    StakeUserRank() {
      if (this.nodeDetail) {
        return this.nodeDetail.StakeUserRank
      }
      return null
    }
  },
  methods: {
    formatLongText($text) {
      const headTailLength = 4
      return format.formatLongText($text, { headTailLength })
    },
    integerToDecimal($val) {
      if ($val) {
        return format.$formatNumber(integerToDecimal($val, 18))
      } else {
        return '--'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.stakeuser {
  width: 100%;
  padding: 0 60px;
  box-sizing: border-box;
  border: 1px solid #002568;
  border-radius: 20px;
  padding: 40px 30px;
  .title {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 27px; /* identical to box height */ /* Zion1 */
    color: #002568;
    text-align: left;
    margin-bottom: 15px;
  }
  .line {
    width: 100%;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>

<template>
<div class="simle-datepicker">
  <my-input :label="label" :focus="handleFocus" :blur="handleBlur" :showCol="true" :modelValue="modelValue" ref="inputRef" />
  <div class="simple-datepicker-panel" v-if="showPanel" @mouseover="handleMouseOver" @mouseleave="handleMouseLeave">
    <div class="simple-datepicker-panel-title">
      <div class="simple-datepicker-panel-prev" @click="handleClickPrev()"></div>
      <div class="simple-datepicker-panel-next" @click="handleClickNext()"></div>
      <div class="simple-datepicker-panel-date">
        {{ year }} 年 {{ month + 1 }} 月
      </div>
    </div>
    <div class="simple-datepicker-panel-block">
      <div class="simple-datepicker-panel-cell" :class="
              item.year === pickDate.year && item.month === pickDate.month && item.date === pickDate.day
              ? ' active'
              : ''
          " v-for="(item, index) in panelMap" :key="'panel-' + index" @click="handleSelectTime(item)">
        {{ item.date }}
      </div>
    </div>
  </div>
</div>
</template>

<script>
import moment from "moment";
import myInput from '../Input';

import {
  onMounted,
  reactive,
  ref,
  unref,
  watchEffect,
} from "vue";

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    label: String,
    modelValue: String
  },
  setup(props, {
    emit
  }) {
    let initVal = moment(Date());

    let panelMap = ref([]);
    let showPanel = ref(false);
    let year = ref(initVal.year());
    let month = ref(initVal.month());
    let day = ref(initVal.date());
    let pickDate = reactive({
      year: -1,
      month: -1,
      day: -1
    })

    let isOver = ref(false);
    let inputRef = ref(null);

    watchEffect(() => {
      console.log(props.modelVal)
    })

    const getConfigByYearMonth = (year, month) => {
      const firstDay = moment()
        .year(year.value)
        .month(month.value)
        .date(1);

      const firstDayWeek = firstDay.day();
      const lastMonthDay = firstDay.subtract(1, "days");

      const prevDateMap = Array.from({
          length: firstDayWeek - 1,
        })
        .map((item, index) => ({
          date: lastMonthDay.date() - index,
          isCurrent: false,
          year: month.value ? unref(year) : unref(year) - 1,
          month: month.value ? unref(month) - 1 : 0,
        }))
        .reverse();

      const currDateMap = Array.from({
        length: moment()
          .year(year.value)
          .month(month.value)
          .daysInMonth(),
      }).map((item, index) => ({
        date: index + 1,
        isCurrent: true,
        year: unref(year),
        month: unref(month),
      }));

      const nextDateMap = Array.from({
        length: 42 - (prevDateMap.length + currDateMap.length),
      }).map((item, index) => ({
        date: index + 1,
        isCurrent: false,
        year: month.value === 11 ? unref(year) + 1 : unref(year),
        month: month.value === 11 ? 0 : unref(month) + 1,
      }));

      panelMap.value = [...prevDateMap, ...currDateMap, ...nextDateMap];
    };

    const handleMonthChange = (isPrev) => {
      if (isPrev) {
        year.value = month.value ? unref(year) : unref(year) - 1,
          month.value = month.value ? unref(month) - 1 : 0
      } else {
        year.value = month.value === 11 ? unref(year) + 1 : unref(year)
        month.value = month.value === 11 ? 0 : unref(month) + 1
      }
    };

    onMounted(() => {
      console.log('inputRef = ', inputRef.value)
    })

    const handleClickPrev = () => {
      handleMonthChange(true)
      inputRef.value.inputFocus()
    }

    const handleClickNext = () => {
      handleMonthChange(false)
      inputRef.value.inputFocus()
    }

    watchEffect(() => {
      getConfigByYearMonth(year, month)
    })

    watchEffect(() => {
      console.log('update map')
      getConfigByYearMonth(year, month);
    });

    const handleFocus = () => {
      showPanel.value = true;
    };

    const handleBlur = () => {
      if (isOver.value) return;

      showPanel.value = false;
    };

    const handleSelectTime = (select) => {
      const {
        year: selectYear,
        month: selectMonth,
        date: selectDate
      } = select;

      emit('update:modelValue', moment()
        .year(selectYear)
        .month(selectMonth)
        .date(selectDate)
        .format("YYYY-MM-DD"));

      year.value = selectYear;
      month.value = selectMonth;
      day.value = selectDate;

      pickDate.year = selectYear
      pickDate.month = selectMonth
      pickDate.day = selectDate

      handleMouseLeave();
      handleBlur();
    };

    const handleMouseOver = () => {
      isOver.value = true;
    };

    const handleMouseLeave = () => {
      isOver.value = false;
    };

    return {
      handleFocus,
      year,
      month,
      day,
      panelMap,
      showPanel,
      handleBlur,
      handleSelectTime,
      handleMouseOver,
      handleMouseLeave,
      handleClickPrev,
      handleClickNext,
      inputRef,
      pickDate
    };
  },
  components: {
    myInput
  }
};
</script>

<style>
.simle-datepicker {
  position: relative;
}

.simple-datepicker-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 300px;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;

  z-index: 100;
}

.simple-datepicker-panel-title {
  height: 32px;
  line-height: 32px;
  border: 1px solid #eee;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  color: #1587f5;

  position: relative;
}

.simple-datepicker-panel-prev,
.simple-datepicker-panel-next {
  box-sizing: border-box;
  border: 8px solid #1587f5;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.simple-datepicker-panel-prev {
  border-color: transparent #1587f5 transparent transparent;
  left: 0;
}

.simple-datepicker-panel-next {
  border-color: transparent transparent transparent #1587f5;
  right: 0;
}

.simple-datepicker-panel-block {
  display: flex;
  flex-wrap: wrap;
}

.simple-datepicker-panel-cell {
  display: inline-block;
  width: calc(100% / 7);
  height: 40px;
  border: 1px solid #eee;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  color: #1587f5;
  box-sizing: border-box;
  cursor: pointer;
}

.active,
.simple-datepicker-panel-cell:hover {
  background: #1587f5;
  color: #eee;
}
</style>

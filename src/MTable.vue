<template>
  <div class="m-table">
    <div class="table-toolbar">
      <div class="bs-bars pull-left">
        <!--用于外部插入的工具条-->
        <slot></slot>
      </div>
      <div class="columns btn-group pull-right">
        <!--自带的工具条上按钮-->
        <button v-if="options.showRefresh"
                class="btn btn-flat btn-default"
                type="button" name="refresh"
                @click="onRefresh"
                >
          <i :class="options.icons.refresh"></i>
        </button>
        <div v-if="options.showColumns" class="keep-open btn-group">
          <button type="button" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false"
                  class="btn btn-flat btn-default dropdown-toggle">
            <i :class="options.icons.columns"></i> <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" role="menu">
            <li v-for="(column,i) in columns" @click.stop>
              <label v-if="!(column.radio || column.checkbox)">
                <input type="checkbox" :data-field="column.filed"
                       v-model="column.visible"> {{column.title}}
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="options.search" class="pull-right search">
        <input class="form-control" type="text" :placeholder="options.locals.formatSearch()"
            @keyup.enter="onSearch" v-model="searchTextTemp">
      </div>
    </div>
    <div class="table-container">
      <table :class = "options.classes">
        <thead>
        <tr>
          <template v-for="column in columns">
            <template v-if="column.visible">
              <th v-if="column.checkbox" :style="{'text-align':column.halign}">
                <input :name="options.selectItemName" type="checkbox"
                  @change="onCheckAllChange" v-model="selected.all">
              </th>
              <th v-else :style="{'text-align':column.halign}"
                  :title="column.titleTooltip">
                {{ column.title }}
              </th>
            </template>
          </template>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(item,i) in renderData" :data-index="i">
          <template v-for="(column,j) in columns">
            <template v-if="column.visible">
              <td v-if="column.checkbox || column.radio"
                  :class="column.classes"
                  :style="{'text-align':column.align,'vertical-align':column.valign}">
                  <input :name="options.selectItemName" v-if="column.checkbox" :value="item" type="checkbox"
                         v-model="selected.items" @change="onCheckItemChange(item)">
                  <input :name="options.selectItemName" v-else type="radio" :value="item"
                         v-model="selected.items" @change="onCheckItemChange(item)">
              </td>
              <td v-else :style="{'text-align':column.align,'vertical-align':column.valign}"
                  :class="column.classes"
                  v-html="fieldValue(item,column,i,j)">
              </td>
            </template>
          </template>

        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="options.pagination" class="table-pagination">
      <div class="pull-left pagination-detail">
        <span class="pagination-info">
            <!--正在显示第 1 条到第 10 条，共 16 条数据-->
            <template v-if="options.onlyInfoPagination">
              {{options.locals.formatDetailPagination(options.totalRows)}}
            </template>
            <template v-else>
              {{options.locals.formatShowingRows(currentPageFrom, currentPageTo, options.totalRows)}}
            </template>
        </span>
        <span v-if="!options.onlyInfoPagination" class="page-list">
            <!--每页显示  10  条数据-->
            {{options.locals.formatRecordsPerPage('pageNumber').split('pageNumber')[0]}}
            <span class="btn-group dropup">
                <button type="button" class="btn btn-flat btn-default dropdown-toggle" data-toggle="dropdown">
                    <span class="page-size">
                        {{options.pageSize === options.totalRows ? options.locals.formatAllRows() : options.pageSize}}
                    </span> <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" role="menu">
                  <li :class="{active: page == options.locals.formatAllRows() || page == options.pageSize}"
                      v-for="page in options.pageList"
                      @click="onPageListChange(page)">
                    <a href="javascript:">{{page}}</a>
                  </li>
                </ul>
            </span> {{options.locals.formatRecordsPerPage('pageNumber').split('pageNumber')[1]}}
        </span>
      </div>
      <div v-if="totalPages > 1" class="pull-right pagination">
        <!--如果大于一页的时候，显示右边的跳页按钮-->
        <ul class="pagination">
          <li class="page-pre"
              @click="onPagePre">
            <a href="javascript:">{{options.paginationPreText}}</a>
          </li>
          <li v-if="pageInfo.first" class="page-first"
              :class="{active: 1 == options.pageNumber}"
              @click="onPageFirst">
            <a href="javascript:">1</a>
          </li>
          <li v-if="pageInfo.firstSeparator" class="page-first-separator disabled">
            <a href="javascript:">...</a>
          </li>
          <li class="page-number"
              :class="{active: i == options.pageNumber}"
              v-for="i in pageInfo.list"
              @click="onPageNumber(i)">
            <a href="javascript:">{{i}}</a>
          </li>
          <li v-if="pageInfo.lastSeparator" class="page-last-separator disabled">
            <a href="javascript:">...</a>
          </li>
          <li v-if="pageInfo.last" class="page-last"
              :class="{active: totalPages == options.pageNumber}"
              @click="onPageLast">
            <a href="javascript:">{{totalPages}}</a>
          </li>
          <li class="page-next"
              @click="onPageNext">
            <a href="javascript:">{{options.paginationNextText}}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style>
.dropdown-menu label {
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
  font-weight: normal;
  padding: 2px 10px;
}

.table-pagination .pagination {
  margin: 0;
}

.table-toolbar .bs-bars, .table-toolbar .search, .table-toolbar .columns {
  position: relative;
  margin-top: 10px;
  margin-bottom: 10px;
  line-height: 34px;
}

.table-pagination div.pagination, .table-pagination .pagination-detail {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
<script>
  // it only does '%s', and return '' when arguments are undefined
  var sprintf = function (str) {
    var args = arguments,
      flag = true,
      i = 1;

    str = str.replace(/%s/g, function () {
      var arg = args[i++];

      /*if (typeof arg === 'undefined') {
        flag = false;
        return '';
      }*/
      return arg;
    });
    return flag ? str : '';
  };

  var DEFAULTS = {
    classes: 'table table-striped table-hover',
    undefinedText: '-',
    escape: false,
    events: undefined,

    ajax: undefined,

    pagination: false,
    sidePagination: 'client', // client or server
    onlyInfoPagination: false,
    totalRows: 0, //
    pageNumber: 1, // current page
    pageSize: 10, // the number rows of per page
    pageList: [10, 25, 50, 100],
    paginationPreText: '<',
    paginationNextText: '>',

    showRefresh: false,
    showColumns: false,
    minimumCountColumns: 1,
    selectItemName: 'btSelectItem',

    icons: {
      paginationSwitchDown: 'glyphicon glyphicon-collapse-down icon-chevron-down',
      paginationSwitchUp: 'glyphicon glyphicon-collapse-up icon-chevron-up',
      refresh: 'glyphicon glyphicon-refresh icon-refresh',
      toggle: 'glyphicon glyphicon-list-alt icon-list-alt',
      columns: 'glyphicon glyphicon-th icon-th',
      detailOpen: 'glyphicon glyphicon-plus icon-plus',
      detailClose: 'glyphicon glyphicon-minus icon-minus'
    },

    locals:{
      formatLoadingMessage() {
        return '载入中，请稍后...';
      },
      formatRecordsPerPage(pageNumber) {
        return sprintf('每页显示 %s 条数据', pageNumber);
      },
      formatShowingRows(pageFrom, pageTo, totalRows) {
        return sprintf('正在显示第 %s 条到第 %s 条，共 %s 条数据', pageFrom, pageTo, totalRows);
      },
      formatDetailPagination(totalRows) {
        return sprintf('共 %s 条数据', totalRows);
      },
      formatSearch() {
        return '搜索';
      },
      formatNoMatches() {
        return '暂无数据';
      },
      formatPaginationSwitch() {
        return '隐藏/显示分页';
      },
      formatRefresh() {
        return '刷新';
      },
      formatToggle() {
        return '切换';
      },
      formatColumns() {
        return '筛选';
      },
      formatAllRows() {
        return '全部';
      }
    }
  };
  var COLUMN_DEFAULTS = {
    field: undefined,
    title: undefined,
    titleTooltip: undefined,
    width: undefined,
    classes: undefined,
    align: undefined, // left, right, center
    halign: undefined, // left, right, center
    valign: undefined, // top, middle, bottom
    radio: false,
    checkbox: false,
    visible: true,
    formatter: undefined,
    events: undefined
  };

  var calculateObjectValue = function (self, name, args, defaultValue) {
    var func = name;

    if (typeof name === 'string') {
      // support obj.func1.func2
      var names = name.split('.');

      if (names.length > 1) {
        func = window;
        $.each(names, function (i, f) {
          func = func[f];
        });
      } else {
        func = window[name];
      }
    }
    if (typeof func === 'object') {
      return func;
    }
    if (typeof func === 'function') {
      return func.apply(self, args);
    }
    if (!func && typeof name === 'string' && sprintf.apply(this, [name].concat(args))) {
      return sprintf.apply(this, [name].concat(args));
    }
    return defaultValue;
  };

  var escapeHTML = function (text) {
    if (typeof text === 'string') {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/`/g, '&#x60;');
    }
    return text;
  };

  var getItemField = function (item, field, escape, undefinedText) {
    var value = item;

    if (typeof field !== 'string' || item.hasOwnProperty(field)) {
      return escape ? escapeHTML(item[field]) : item[field];
    }
    var props = field.split('.');
    for (var p in props) {
      value = value && value[props[p]];
    }
    return (escape ? escapeHTML(value) : value) || undefinedText;
  };


  export default{
    props: {
      columns: {
        type: Array,
        required: true,
        default: function () {
          return [];
        }
      },
      data: {
        type: Array,
        default: function () {
          return [];
        }
      },
      options: {
        type: Object,
        default: function () {
          return {};
        }
      }
    },
    mounted(){
      if(this.options.sidePagination === 'server'){
        this.initServer();
      }
      this.$nextTick(this.initEvents);
    },
    created(){
      //init table
      var that = this;
      this.columns.forEach(function(column,i){
        //only one radio or checkbox is allowed
        if(column.radio || column.checkbox){
          if(that.selected.type){
            column.radio = false;
            column.checkbox = false;
          } else {
            that.selected.type = column.radio ? 'radio' : 'checkbox';
          }
        }

        that.$set(that.columns,i,$.extend({}, COLUMN_DEFAULTS, column));
      });

      var op = $.extend({},DEFAULTS,this.options);
      if(op.sidePagination === 'client'){
        op.totalRows = this.data.length;
      }
      for(let key in op){
        this.$set(this.options,key,op[key]);
      }
    },
    data(){
      return {
        searchTextTemp:'',
        searchText:'',
        selected: {
          type:undefined,
          all: false,
          items: []
        }
      }
    },
    watch:{
      'data.length' : function(val,oldVal){
        if(this.options.sidePagination === 'client'){
          this.options.totalRows = this.data.length;
        }
      }
    },
    computed: {
      renderData(){
        let data = [];
        if(this.options.sidePagination === 'client'){
          data = this.data.slice(this.currentPageFrom - 1, this.currentPageTo);
        } else {
          data = this.data;
        }

        return data;
      },
      pageInfo() {
        var i, from, to,
          info = {};

        if (this.totalPages < 5) {
          //if the number of pages less than five,show all.
          from = 1;
          to = this.totalPages;
        } else {
          from = this.options.pageNumber - 2;
          to = from + 4;
          if (from < 1) {
            from = 1;
            to = 5;
          }
          if (to > this.totalPages) {
            to = this.totalPages;
            from = to - 4;
          }
        }

        if (this.totalPages >= 6) {
          if (this.options.pageNumber >= 3) {
            info.first = true;
            from++;
          }

          if (this.options.pageNumber >= 4) {
            if (this.options.pageNumber == 4 || this.totalPages == 6 || this.totalPages == 7) {
              from--;
            } else {
              info.firstSeparator = true;
            }

            to--;
          }
        }

        if (this.totalPages >= 7 && this.options.pageNumber >= (this.totalPages - 2)) {
          from--;
        }

        if (this.totalPages === 6 && this.options.pageNumber >= this.totalPages - 2) {
          to++;
        } else if (this.totalPages >= 7 && (this.totalPages === 7 ||
          this.options.pageNumber >= this.totalPages - 3)) {
          to++;
        }

        info.list = [];
        for (i = from; i <= to; i++) {
          info.list.push(i);
        }

        if (this.totalPages >= 8 && this.options.pageNumber <= this.totalPages - 4) {
          info.lastSeparator = true;
        }

        if (this.totalPages >= 6 && this.options.pageNumber <= this.totalPages - 3) {
          info.last = true;
        }
        //{first,firstSeparator,list,lastSeparator,last}
        return info;
      },
      totalPages(){
        return parseInt((this.options.totalRows + this.options.pageSize -1) / this.options.pageSize);
      },
      currentPageFrom(){
        return (this.options.pageNumber-1) * this.options.pageSize + 1;
      },
      currentPageTo(){
        let rowCount = this.options.pageNumber * this.options.pageSize;
        return rowCount < this.options.totalRows ? rowCount : this.options.totalRows;
      }

    },
    methods: {
      fieldValue(item, column, i, j) {
        var value = getItemField(item, column.field, this.options.escape);

        return calculateObjectValue(column,
          column.formatter, [value, item, i], value);
      },
      onPageListChange(size){
        this.options.pageSize = size;
        this.updateTableData();
      },
      onPagePre(){
        if (this.options.pageNumber > 1) {
          this.options.pageNumber--;
          this.updateTableData();
        }
      },
      onPageFirst(){
        if (this.options.pageNumber != 1) {
          this.options.pageNumber = 1;
          this.updateTableData();
        }
      },
      onPageNumber(num){
        if (num >= 1 && num <= this.totalPages && this.options.pageNumber != parseInt(num)) {
          this.options.pageNumber = parseInt(num);
          this.updateTableData();
        }
      },
      onPageLast(){
        if (this.options.pageNumber != this.totalPages) {
          this.options.pageNumber = this.totalPages;
          this.updateTableData();
        }

      },
      onPageNext(){
        if (this.options.pageNumber < this.totalPages) {
          this.options.pageNumber++;
          this.updateTableData();
        }
      },
      onRefresh(){
        this.updateTableData();
      },
      onSearch(event){
        this.searchTextTemp = this.searchTextTemp.trim();

        if (this.searchTextTemp !== this.searchText) {
          this.searchText = this.searchTextTemp;
          this.updateTableData();
        }
      },
      onCheckAllChange(){
        let items = [];
        if (this.selected.all) {
          for (var i = this.currentPageFrom - 1; i < this.currentPageTo; i++) {
            items.push(this.data[i]);
          }
          this.$emit('trigger',{event:'check-all'});
        } else {
          this.$emit('trigger',{event:'uncheck-all'});
        }
        this.selected.items = items;
      },
      onCheckItemChange(item){
        if(this.selected.type === 'radio'){
          this.$emit('trigger',{event:'check',item:item});
        } else {
          let count = this.currentPageTo - this.currentPageFrom + 1;
          this.selected.all = (this.selected.items.length == count);
          let selected = this.selected.items.indexOf(item) > - 1;
          this.$emit('trigger',{event:selected ? 'check' : 'uncheck',item:item});
        }
      },
      updateTableData() {
        this.selected.all = false;
        this.selected.items = [];

        if (this.options.sidePagination === 'server') {
          this.initServer();
        }
      },
      initServer(){
        if (this.options.ajax) {
          let param = {
            offset: this.currentPageFrom - 1,
            limit: this.options.pageSize,
            search: this.searchText
          };
          this.options.ajax.apply(this, [param, this]);
        }
      },
      initEvents(){
        let that = this;
        let $tbody = $(this.$el).find('tbody');

        if (this.options.events) {
          let events = this.options.events;
          for (var key in events) {
            let index = key.indexOf(' '),
              name = key.substring(0, index),
              el = key.substring(index + 1),
              func = events[key];

            $tbody.delegate(el, name, function (event) {
              let $tr = $(event.currentTarget).parents('tr');
              let rowIndex = $tr.data('index'),
                row = that.renderData[rowIndex];

              func.apply(this, [event, row, rowIndex, that]);
            });
          }
        }
      }
    }
  }
</script>

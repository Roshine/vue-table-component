<template>
  <div class="container">
    test
    <button @click="testClk">button</button>
    <MTable :columns="columns" :data="data" :options="options" @trigger="triggerFunc" style="margin-top:30px;">
      <button class="btn btn-primary">slot</button>
    </MTable>
  </div>
</template>
<style>

</style>
<script>
  import MTable from './MTable.vue'

  export default{
    data(){
      let that = this;
      return {
        columns: [
          {
            title: '#',
            field: 'select',
            checkbox: true
          },
          {
            title: '样本ID',
            field: 'id',
            visible: true
          },
          {
            title: '样本名称',
            field: 'name',
            visible:true,
            formatter:function(value,row,index){
              return '<button class="btn btn-default">' + value + '</button>';
            }
          },
          {
            title: '使用次数',
            field: 'usedCount',
            align: 'center',
            classes:'success',
            titleTooltip:'6666666'
          }
        ],
        data:[
          {
            select:false,
            id:1,
            name:'123',
            usedCount:10
          },
          {
            select:false,
            id:2,
            name:'123',
            usedCount:10
          },
          {
            select:false,
            id:3,
            name:'123',
            usedCount:10

          }
        ],
        options:{
          classes:['table','table-striped'],
          showRefresh : true,
          search : true,
          showColumns : true,
          pagination : true,
          sidePagination : 'server',
          ajax:function(param,table){
            console.log(param);
            $.get('/static/table1.json',function(data){
              that.data = data.rows;
              that.options.totalRows = data.total;
            });
          },
          events:{
            'click .btn':function(e, row, index,table){

              alert(JSON.stringify(row));
            }
          }
        }

      }
    },
    methods:{
      testClk(){
        //this.columns[2].visible=false;
        //this.$set(this.columns[2],'visible',false);
        //this.options.showColumns = true;
        //this.options.icons.refresh = 'glyphicon glyphicon-collapse-up icon-chevron-up';
        for(let i=0;i<100;i++){
          this.data.push({
            select:false,
            id:2,
            name:'123',
            usedCount:i
          });
        }

        /*icons: {
          paginationSwitchDown: 'glyphicon glyphicon-collapse-down icon-chevron-down',
            paginationSwitchUp: 'glyphicon glyphicon-collapse-up icon-chevron-up',
            refresh: 'glyphicon glyphicon-refresh icon-refresh',
            toggle: 'glyphicon glyphicon-list-alt icon-list-alt',
            columns: 'glyphicon glyphicon-th icon-th',
            detailOpen: 'glyphicon glyphicon-plus icon-plus',
            detailClose: 'glyphicon glyphicon-minus icon-minus'
        },*/
        //this.$set(this.options,'showColumns',true);
      },
      triggerFunc(info){
        console.log(info);
      }
    },
    components: {
      MTable
    }
  }
</script>

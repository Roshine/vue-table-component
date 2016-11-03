<template>
  <div class="container">
    <MTable :columns="columns" :data="data" :options="options" @trigger="triggerFunc" style="margin-top:30px;">
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
            align: 'center'
          }
        ],
        data:[],
        options:{
          classes:'table table-striped table-hover',
          showRefresh : true,
          search : true,
          showColumns : true,
          pagination : true,
          sidePagination : 'server',
          ajax:function(param,table){
            console.log(param);
            $.get('/static/table1.json',function(data){
              that.options.totalRows = data.rows.length;
              that.data = data.rows.splice(param.offset,param.offset + param.limit);

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
      triggerFunc(info){
        console.log(info);
      }
    },
    components: {
      MTable
    }
  }
</script>

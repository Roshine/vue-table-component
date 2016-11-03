<template>
  <div class="container">
    <MTable :columns="columns" :data="data" :options="options" @trigger="triggerFunc" style="margin-top:30px;">
      <button @click="testClk" class="btn btn-primary">insert 100 rows</button>
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
          classes:'table table-striped table-hover',
          showRefresh : true,
          search : true,
          showColumns : true,
          pagination : true,
          sidePagination : 'client',
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
        for(let i=0;i<100;i++){
          this.data.push({
            select:false,
            id:2,
            name:'123',
            usedCount:i
          });
        }
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

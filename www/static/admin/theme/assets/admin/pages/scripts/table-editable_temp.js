var TableEditable = function () {

    var handleTable = function () {

        var table = $('#sample_editable_1');

        var oTable = table.dataTable({

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
            // So when dropdowns used the scrollable div should be removed. 
            //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // set the initial value
            "pageLength": 10,

            "language": {
                "lengthMenu": " _MENU_ records"
            },
            "columnDefs": [{ // set default column settings
                'orderable': true,
                'targets': [0]
            }, {
                "searchable": true,
                "targets": [0]
            }],
            "order": [
                [3, "desc"]
            ] // set first column as a default sort by asc
        });

        var tableWrapper = $("#sample_editable_1_wrapper");

        tableWrapper.find(".dataTables_length select").select2({
            showSearchInput: true //hide search box with special css class
        }); // initialize select2 dropdown


        table.on('click', '.delete', function (e) {
            e.preventDefault();

            if (confirm("确定要删除吗 ?") == false) {
                return;
            }

            var t = $(this);

            var id = t.attr('data-id');
            $.ajax({
                url:'/admin/template/deldata',
                type:'POST',
                cache: false,
                data:{
                    id:id
                },
                complete:function(xhr, textStatus){
                    if(textStatus == 'success' && xhr.status == '200'){
                        var response = eval("("+xhr.responseText+")");
                        window.console && console.log('deluserbyid get data',response);
                        if(response.errno == 0){//返回数据正常
                            var nRow = t.parents('tr')[0];
                            oTable.fnDeleteRow(nRow);

                        }else{
                            alert('删除失败');
                        }

                    }else{
                        alert('删除失败');
                        window.console && console.log('error',xhr, textStatus);
                    }
                }
            });


        });



    }

    return {

        //main function to initiate the module
        init: function () {
            handleTable();
        }

    };

}();
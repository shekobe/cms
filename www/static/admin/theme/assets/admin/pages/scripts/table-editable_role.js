var TableEditable = function () {

    var handleTable = function () {

        function restoreRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);

            for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                oTable.fnUpdate(aData[i], nRow, i, false);
            }

            oTable.fnDraw();
        }

        function editRow(oTable, nRow) {
            var aData = oTable.fnGetData(nRow);
            var jqTds = $('>td', nRow);
            jqTds[0].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[0] + '">';
            jqTds[1].innerHTML = '<input type="text" class="form-control input-small" value="' + aData[1] + '">';

            jqTds[2].innerHTML = '<a class="edit btn default green" href="">保存</a>';
            jqTds[3].innerHTML = '<a class="cancel btn default red" href="">取消</a>';
            jqTds[4].innerHTML = '<a class="btn default red j_cdsq" href="">菜单授权</a>';
        }

        function saveRow(oTable, nRow) {

            var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
            oTable.fnUpdate('<a class="edit btn default green" href="">修改</a>', nRow,2, false);
            oTable.fnUpdate('<a class="delete btn default red" href="">删除</a>', nRow, 3, false);
            oTable.fnUpdate('<a class="btn default red j_cdsq" href="">菜单授权</a>', nRow, 4, false);
            oTable.fnDraw();
        }

        function cancelEditRow(oTable, nRow) {
            var jqInputs = $('input', nRow);
            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);

            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
            oTable.fnUpdate('<a class="edit btn default green" href="">修改</a>', nRow, 2, false);
            oTable.fnDraw();
        }

        var table = $('#sample_editable_1');

        var oTable = table.dataTable({

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
            // So when dropdowns used the scrollable div should be removed. 
            //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

            //"lengthMenu": [
            //    [5, 15, 20, -1],
            //    [5, 15, 20, "All"] // change per page values here
            //],

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // set the initial value
            //"pageLength": 10,
            //
            //"language": {
            //    "lengthMenu": " _MENU_ records"
            //},
            //"columnDefs": [{ // set default column settings
            //    'orderable': false,
            //    'targets': [0]
            //}, {
            //    "searchable": false,
            //    "targets": [0]
            //}],
            //"order": [
            //    [0, "asc"]
            //] // set first column as a default sort by asc
        });

        var tableWrapper = $("#sample_editable_1_wrapper");

        tableWrapper.find(".dataTables_length select").select2({
            showSearchInput: true //hide search box with special css class
        }); // initialize select2 dropdown

        var nEditing = null;
        var nNew = false;

        $('#sample_editable_1_new').click(function (e) {
            e.preventDefault();

            if (nNew && nEditing) {
                if (confirm("Previose row not saved. Do you want to save it ?")) {
                    saveRow(oTable, nEditing); // save
                    $(nEditing).find("td:first").html("Untitled");
                    nEditing = null;
                    nNew = false;

                } else {
                    oTable.fnDeleteRow(nEditing); // cancel
                    nEditing = null;
                    nNew = false;
                    
                    return;
                }
            }

            var aiNew = oTable.fnAddData(['', '', '', '', '', '']);
            var nRow = oTable.fnGetNodes(aiNew[0]);
            editRow(oTable, nRow);
            nEditing = nRow;
            nNew = true;
        });

        table.on('click', '.delete', function (e) {
            e.preventDefault();

            if (confirm("确定要删除此用户吗 ?") == false) {
                return;
            }

            var nRow = $(this).parents('tr')[0];
            oTable.fnDeleteRow(nRow);
            var id = $(this).closest('tr').attr('data-id');
            $.ajax({
                url:'/admin/role/deldata',
                type:'POST',
                cache: false,
                data:{
                    id:id,
                    qktoken:$('input[name="qktoken"]').val()
                },
                complete:function(xhr, textStatus){
                    if(textStatus == 'success' && xhr.status == '200'){
                        var response = eval("("+xhr.responseText+")");
                        window.console && console.log('deluserbyid get data',response);
                        if(response.errno == 0){//返回数据正常


                        }else{

                        }

                    }else{
                        window.console && console.log('error',xhr, textStatus);
                    }
                }
            });
        });

        table.on('click', '.cancel', function (e) {
            e.preventDefault();
            if (nNew) {
                oTable.fnDeleteRow(nEditing);
                nEditing = null;
                nNew = false;
            } else {
                restoreRow(oTable, nEditing);
                nEditing = null;
            }
        });

        table.on('click', '.edit', function (e) {
            e.preventDefault();

            /* Get the row as a parent of the link that was clicked on */
            var nRow = $(this).parents('tr')[0];
            var t = $(this);
            if (nEditing !== null && nEditing != nRow) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                restoreRow(oTable, nEditing);
                editRow(oTable, nRow);
                nEditing = nRow;
            } else if (nEditing == nRow && this.innerHTML == "保存") {
                /* Editing this row and want to save it */


                //alert("Updated! Do not forget to do some ajax to sync with backend :)");
                var jqInputs = $('input', nEditing);
                window.console && console.log(t.closest('tr').attr('data-id'),jqInputs[1].value);
                var id = t.closest('tr').attr('data-id');
                if(id){//修改
                    $.ajax({
                        url:'/admin/role/updatedata',
                        type:'POST',
                        cache: false,
                        data:{
                            id: t.closest('tr').attr('data-id'),
                            qktoken:$('input[name="qktoken"]').val(),
                            roleName:jqInputs[0].value,
                            info:jqInputs[1].value
                        },
                        complete:function(xhr, textStatus){
                            if(textStatus == 'success' && xhr.status == '200'){
                                var response = eval("("+xhr.responseText+")");
                                window.console && console.log('deluserbyid get data',response);
                                if(response.errno == 0){//返回数据正常
                                    toastr.success('保存成功！')
                                    saveRow(oTable, nEditing);
                                    nEditing = null;

                                }else{

                                }

                            }else{
                                window.console && console.log('error',xhr, textStatus);
                            }

                        }
                    });
                }else{//新增
                    $.ajax({
                        url:'/admin/role/add',
                        type:'POST',
                        cache: false,
                        data:{
                            qktoken:$('input[name="qktoken"]').val(),
                            roleName: jqInputs[0].value,
                            info:jqInputs[1].value
                        },
                        complete:function(xhr, textStatus){
                            if(textStatus == 'success' && xhr.status == '200'){
                                var response = eval("("+xhr.responseText+")");
                                window.console && console.log('add data',response);
                                if(response.errno == 0){//返回数据正常
                                    var id = response.data._id;
                                    t.closest('tr').attr('data-id',id);
                                    saveRow(oTable, nEditing);
                                    nEditing = null;
                                }else{

                                }

                            }else{
                                window.console && console.log('error',xhr, textStatus);
                            }

                        }
                    });
                }


            } else {
                /* No edit in progress - let's start one */
                editRow(oTable, nRow);
                nEditing = nRow;
            }
        });
    }

    return {

        //main function to initiate the module
        init: function () {
            handleTable();
        }

    };

}();
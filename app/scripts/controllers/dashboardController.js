'use strict';

app.controller('dashboardController', ['$scope', '$location', 'Service', '$timeout', '$state',
    function($scope, $location, Service, $timeout, $state) {
    var data = $scope.data = {};
    var fn = $scope.fn = {};

    $scope.data.headMoveItems = [
        {title: 'Tabel Manager', value: 0},
        {title: 'Upload Image', value: 1}
    ];

    $scope.data.addTableHeads = [
        {id: 0, name: '操作'},
        {id: 1, name: '字段名'},
        {id: 2, name: '字段属性'},
        {id: 3, name: '能否为空'},
        {id: 4, name: '主键'}
    ];

    $scope.data.container = {};
    $scope.data.workingSheet = {};
    $scope.data.tableRows = [];
    $scope.data.imageFile = {};

    $scope.data.draggable = {
        animate: 'true',
        onDrag: 'fn.itemDrag(this)',
        onStop: 'fn.itemStop(this)'
    }

    $scope.data.droppable = {
        onDrop: 'fn.itemDrop(this)',
        onOver: 'fn.itemOver(this)',
        onOut: 'fn.itemLeave(this)'
    }

    $scope.fn = {
        itemDrag: function(_this) {
            _this.target.style.opacity = '0.5';
        },

        itemStop: function(_this) {
            _this.target.style.opacity = '1';
        },

        itemDrop: function(_this) {
            _this.target.style.backgroundColor = '#FFFFFF';
            _this.target.firstElementChild.style.transform = 'rotate(0deg)';
            var id = parseInt(_this.toElement.id);
            angular.forEach($scope.data.headMoveItems, function(n) {
                if(n.value == id) {
                    $scope.data.workingSheet = n;
                }
            });
            switch (id) {
                case 0:
                    $location.path('/dashboard/tabelManager');
                    $timeout(function() {
                        $scope.fn.initDbTree();
                    }, 1000);
                    break;
                case 1:
                    $location.path('/dashboard/imageManager');
                    $timeout(function() {
                        $scope.fn.fileManager();
                    }, 1000);
                    break;
                default:
                    break;
            }
        },

        itemOver: function(_this) {
            _this.target.style.backgroundColor = 'rgba(255,255,255, 0.5)';
        },

        itemLeave: function(_this) {
            _this.target.style.backgroundColor = '#FFFFFF';
        },

        revert: function() {
            window.location.href = '/#/dashboard';
            window.location.reload();
        },

        filter: function(treeId, parentNode, responseData) {
            if(!responseData) return null;
            angular.forEach(responseData.data, function(n, index) {
                if(parentNode.id == 1) {
                    n.isParent = true;
                    n.icon = '../../images/sqlite3/tables.png';
                }
                if(parentNode.id != 1) {
                    n.columData = JSON.stringify(n);
                    n.isParent = false;
                    n.icon = '../../images/sqlite3/table_colums.png';
                }
                n.id = '' + parentNode.id + index;
                n.pId = parentNode.id;
                n.type = parentNode.id + 1;
            });
            return responseData.data;
        },

        createTable: function() {
            $state.go('dashboard.tabelManager.addTable');
        },

        addRow: function() {
            var row = {timeId: new Date().getTime()};
            $scope.data.tableRows.push(row);
        },

        removeRow: function(row) {
            angular.forEach($scope.data.tableRows, function(n, index) {
                if(n.timeId == row.timeId) {
                    $scope.data.tableRows.splice(index, 1);
                }
            });
        },

        submitTable: function() {
            var flag = true;
            var pkCount = 0;
            angular.forEach($scope.data.tableRows, function(n, index) {
                if(n.pk) {
                    pkCount ++;
                }
            });
            if(pkCount != 1) {
                alert('主键有切仅有一个');
                flag = false;
            }
            if(flag) {
                Service.createTable($scope.data.tableName, $scope.data.tableRows).then(function(data) {
                    alert('创建表' + $scope.data.tableName + '成功');
                });
            }
        },

        showRemoveBtn: function(treeId, treeNode) {
            return (treeNode.pId == 1);
        },

        showRenameBtn: function(treeId, treeNode) {
            return false;
        },

        initDbTree: function() {
            // Ztree init
            var setting = {
                view: {
        			dblClickExpand: false,
        			showLine: true,
        			selectedMulti: false
        		},
                edit: {
                    enable: true,
                    showRemoveBtn: $scope.fn.showRemoveBtn,
                    showRenameBtn: $scope.fn.showRenameBtn
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: 'id',
                        pIdKey: 'pId',
                        rootPId: ""
                    }
                },
                callback: {
        			beforeClick: function(treeId, treeNode) {
        				var zTree = $.fn.zTree.getZTreeObj("dbTree");
        				if (treeNode.isParent) {
        					zTree.expandNode(treeNode);
        					return false;
        				} else {
                            $scope.data.columDatas = JSON.parse(treeNode.columData);
                            $scope.data.columHeads = [];
                            $scope.data.columData = [];
                            for(var key in $scope.data.columDatas) {
                                if(key) {
                                    $scope.data.columHeads.push(key);
                                }
                                $scope.data.columData.push($scope.data.columDatas[key]);
                            }
        				    $state.go('dashboard.tabelManager.colum');
        				}
        			},
                    beforeRemove: function(treeId, treeNode) {
                        return confirm('确定删除表' + treeNode.name + '吗?');
                    },
                    onRemove: function(e, treeId, treeNode) {
                        Service.dropTable(treeNode.name).then(function(data) {
                            console.log(data);
                        });
                    }
        		},
                async: {
                    enable: true,
                    url: '/api/getDatabaseInfo',
                    type: 'post',
                    autoParam: ['type=postType', 'name=tableName'],
                    dataFilter: $scope.fn.filter
                }
            };
            var zNodes = [
                {id: 1, pId: 0, name: 'LoL Tables', type: 1, open: false, isParent: true, iconClose: '../../images/sqlite3/data.png', iconOpen: '../../images/sqlite3/data_folder.png'}
            ];
            $.fn.zTree.init($('#dbTree'), setting, zNodes);
        },

        fileManager: function() {
            var file = angular.element(document.querySelector('#fileSelector'))[0];
            var imageArea = angular.element(document.querySelector('#imageArea'))[0];
            file.onchange = function(event) {
                var f = event.target.files[0];
                if(!/image\/\w+/.test(f.type)){
                    alert("请确保文件为图像类型");
                    return false;
                }
                var reader = new FileReader();
                reader.readAsDataURL(f);
                reader.onload = function(e) {
                    imageArea.src = this.result;
                    $scope.data.imageFile = {
                        image: this.result,
                        imageName: f.name.substr(0, f.name.lastIndexOf('.')),
                        imageSize: e.total
                    }
                }
            }
        },

        imageZoomIn: function() {
            var imageArea = $('#imageArea');
            if(imageArea.height() < 700) {
                imageArea.height(imageArea.height() + 50);
            }
        },

        imageZoomOut: function() {
            var imageArea = $('#imageArea');
            if(imageArea.height() > 400) {
                imageArea.height(imageArea.height() - 50);
            }
        },

        uploadImage: function() {
            if($scope.data.imageFile.imageSize) {
                Service.uploadImage($scope.data.imageFile).then(function(data) {
                    console.log(data);
                });
            }
        }

    }

}]);

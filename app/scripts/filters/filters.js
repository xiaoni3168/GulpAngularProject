'use strict';

app.filter('tableColumHead', function() {
    return function(head) {
        var heads = {
            'cid': '字段ID',
            'name': '字段名',
            'type': '字段属性',
            'notnull': '是否为空',
            'dflt_value': '默认值',
            'pk': '主键'
        };
        return heads[head];
    }
});

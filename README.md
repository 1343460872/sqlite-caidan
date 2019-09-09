


# 使用

- 引用
```
const db = require('sqlite-caidan')
```

- 连接数据库
```
db.conn('db/test', ( hasDb ) => {
　
    if(!hasDb) {
        db.create('all_group', [
            'id',
            {text: ['group_name', 'group_id']}
        ])
    }
})
```
　
- 创建表
```
/*
* id 默认是整型、自增长、主键、非空,其它字段名默认是text
* 以下三个方法的作用相同
*
*/
create('sessions', [
    'id-integer-primary-key-autoincrement-not-null',
    'scene-text',
    'fromIM-text',
    'fromNick-text',
    'time-integer'
])
create('sessions', [
    'id',
    'scene',
    'fromIM',
    'fromNick',
    'time-integer'
])
create('sessions', [
    'id',
    {
        text: ['scene', 'fromIM', 'fromNick'],
        integer: ['time']
    }
])
```
　
- 插入行
```
insert('sessions','alex, man', {fields: 'name, sex'})
```


# API　

### 操作库

- 连接数据库
```
conn(db_path, fn)
```
- 手动写入数据库
```
end()
```


#### 操作表
- 表存在
````
hasTable(table)
````
- 增加表
```
create(table, fields)
// id 默认是整型、自增长、主键、非空,其它字段名默认是text
create('sessions', [
        'id-integer-primary-key-autoincrement-not-null',
        'scene-text',
        'fromIM-text',
        'fromNick-text',
        'time-integer'
])
create('sessions', ['id','scene', 'fromIM', 'fromNick', 'time-integer'])
create('sessions', [
    'id',
    {
        text: ['scene', 'fromIM', 'fromNick'],
        integer: ['time']
    }
])
```
- 删除表
````
del( table )
````
- 表筛选
````
hasRow( table, field )
hasRow( item.id, { idClient: item.lastMsg.idClient } )
````
- 表的列名
````
column(table)
column('sessions')
````

#### 操作行
- 插入行
```
insert(table, values, args)
insert('sessions', 'alex, man, 18')
insert('sessions', 'alex, man', { fields: 'name, sex' })
// 字段值有空格引号时用下列语句
insert(
    'team',
    `${arg[i].teamId}@@${arg[i].name}@@${arg[i].owner}`,
    {save: -1, symbol: '@@'}
)
```
- 修改行
````
update(table, set_, where_)
update('sessions',{
        unread: unread+1,
        updateTime: new Date().getTime()
    },
    {
        fromId: fromId
    }
)
````
- 删除行
````
del(table, field)
db.del('team', {teamId: teamId})
````

- 两表联查
```
join(fields, table1, table2, where)
join(
    'sessions2.fromNick, sessions2.id, age',
    'sessions1',
    'sessions2',
    'sessions1.id=sessions2.id'
)
```

#### 其它
- 查询
```
query(sql)
var msgs = db.query(`select * from '${arg}' order by time desc limit 0,20`)
```
- 增改删
```
run(sql)
run(sqlstr += `update '${arg}' set read='true' where idClient='${idClient}';`)
```








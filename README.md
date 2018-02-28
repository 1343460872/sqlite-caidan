
1. 安装　

```
npm install
```

2. 运行，将在 `/db` 创建 `test.sqlite`　

```
node index.js
```


## 使用 ##
　

- 连接数据库
```
db.conn('db/test', ( hasDb ) => {
　
    if(!hasDb){
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
* 以下三行语句的作用相同
*
*/
create('sessions',['id-integer-primary-key-autoincrement-not-null','scene-text', 'fromIM-text', 'fromNick-text', 'time-integer'])
create('sessions',['id','scene', 'fromIM', 'fromNick', 'time-integer'])
create('sessions',['id',{text: ['scene', 'fromIM', 'fromNick'], integer: ['time']}])
```
　
- 插入行
```
insert('sessions','alex, man', {fields: 'name, sex'})
```


## API　

#### 操作库
```
准备中
```

#### 操作表
```
准备中
```

#### 操作行
```
准备中
```

#### 其它
```
准备中
```







const sql = require('sql.js');
const fs = require('fs')
const path = require('path')



global.db = null
global.db_path = ''
/*

 global.db_config = {
    'sessions1': ['id','scene', 'fromIM', 'fromNick', 'time-integer'],
    'sessions2': ['id','scene'],
 }
 
 */

/*
* 连接数据库
*
* conn('db/test', ( hasDb ) => {
*     if(!hasDb){
*         db.create('all_group', [
*             'id',
*             {text: ['group_name', 'group_id']}
*         ])
*     }
* })
*
* */

const conn = function(db_path, fn){
    let file = path.join(db_path + '.sqlite')
    global.db_path = db_path
    const hasDB =  fs.existsSync(file)
    if(hasDB){
        global.db = new sql.Database(fs.readFileSync(file))
    }else{
        global.db = new sql.Database()
    }
    fn&&fn(hasDB)

}



/*
 * 两表联查
 *join('sessions2.fromNick, sessions2.id, age', 'sessions1', 'sessions2', 'sessions1.id=sessions2.id')
 *
 *
 *
 * */
const join = function (fields,table1,table2,where) {
    return query(`select ${fields} from '${table1}' inner join '${table2}' on ${where}`)

}

// 写入数据库
const end = function () {
    var data = global.db.export()
    var buffer = new Buffer(data)
    let file = path.join(db_path + '.sqlite')
    fs.writeFileSync(file, buffer)
    console.log('success')
}



/*
 * 执行sql语句
 *
 *使用方法：
 * query  用于查询
 *
 *
 * */
const query = function (sql) {
    return global.db.exec(sql)
}


/*
 * 执行sql语句
 *
 *使用方法：
 * run  用于执行
 *
 *
 * */
const run = function (sql) {
    global.db.run(sql)
    end()
}


/*
 * 新建表
 *
 * 使用方法：
 * create('sessions',['id-integer-primary-key-autoincrement-not-null','scene-text', 'fromIM-text', 'fromNick-text', 'time-integer'])
 * create('sessions',['id','scene', 'fromIM', 'fromNick', 'time-integer'])   // id 默认是整型、自增长、主键、非空,其它字段名默认是text
 * create('sessions',['id',{text: ['scene', 'fromIM', 'fromNick'], integer: ['time']}])
 *
 *
 * */
const create = function (table, fields) {

    let field = ''
    fields.forEach((item, index, fields) => {
        switch(true){
    case item == 'id':
        key = 'id'
        val = ['integer','primary key','autoincrement','not null']
        field += `"${key}"  ${val.join(' ')},`    // "id"  integer primary key autoincrement not null
        break

    case typeof item == 'string':
        item = item.includes('-') ? item : item+'-text'
        val = item.split('-')
        key = val[0]
        val.splice(0,1)
        field += `"${key}"  ${val.join(' ')},`    // "id"  integer primary key autoincrement not null
        break

    case typeof item == 'object':   // "scene"  text, "fromIM"  text, "fromNick"  text, "time"  integer,
        for(i in item){
            val = i;
            arr = item[i]
            len = arr.length
            ii = 0
            while(ii < len){
                field += `"${arr[ii]}"  ${val},`
                ii++
            }
        }
        break
    }
})

    fields = field.replace(/,$/g,'')
    run(`create table '${table}' (${fields})`)

}




/*
 * 插入行
 * 默认有id, 每次插入不改id
 *
 * 使用方法:
 * insert('sessions','alex, man, 18')
 * insert('sessions','alex, man', {fields: 'name, sex'})
 * // 字段值有空格引号时用下列语句
 * insert('team', `${arg[i].teamId}@@ ${arg[i].name}@@ ${arg[i].owner}`,{save: -1,symbol:'@@'})
 *
 *
 * */
const insert = function (table, values, args) {

    let fields, val
    let arg = args || {}
    let hasId = column(table).includes('id')
    let save = arg.save==-1 ? false : true
    let symbol = arg.symbol || ','
    fields = arg.fields ? arg.fields : column(table);
    fields = fields.join(',')

    
    val =   `'${values.split(symbol).map((v)=>
                v.trim()
            ).join("','")}'`
    if(hasId){
        fields =  'id,'+ fields
        val =  'null,'+ val
    }
    
    try{
        run(`insert into '${table}' (${fields}) values (${val});`)
        save&&end()
    }catch(e){
        
    }
}


/*
 * 更改行
 *
 * 使用方法:
 * update('sessions',{unread:unread+1,updateTime:new Date().getTime()},{fromId:fromId})
 *
 *
 * */

const update = function (table, set_, where_) {

    let set = jsonToStr2(set_)
    let where = jsonToStr2(where_)
    run(`update '${table}' set ${set} where ${where};`)
    // end()
}



/*
 * 删除行
 * 默认有id, 每次插入不改id
 *
 * 使用方法:
 * del('sessions')
 *
 * */

const del = function (table, field) {

    const where = field ? 'where '+jsonToStr(field) : ''

    run(`delete from '${table}' ${where}`)
    // end()

}


function jsonToStr2(obj){
    let str = ''
    for(i in obj){
        if(typeof obj[i]=='string' && obj[i].includes('unread')){
            str += i + "=" + obj[i] +","
        }else{
            str += i + "='" + obj[i] +"',"

        }
    }
    str = str.replace(/,$/g,'')
    return str

}


function jsonToStr(obj){
    let str = ''
    for(i in obj){
        var val = typeof obj[i] == 'string' ? obj[i].replace(/[']/g, '') : obj[i]
        str += i + "='" + val +"',"
    }
    str = str.replace(/,$/g,'')
    return str

}


/*
 * 获
 *取一张表的所有列
 * 使用方法:
 * column('sessions')
 *
 *
 * */
const column = function (table) {
    col = query(`select sql from sqlite_master where tbl_name = '${table}' and type='table';`)
    r = col[0].values[0][0].match(/"(.*?)"/g).join('-').replace(/["|"]/g,'').split('-')
    r.splice(0,1)
    return r

}




/*
 * 判断表是否存在
 *
 * 使用方法:
 * hasTable('sessions')
 *
 *
 * */

const hasTable = function (table) {
    return !!query(`select count(*) from sqlite_master where type='table' and name='${table}'`)[0].values[0][0]

}



/*
 * 判断一张表是否有符合条件的数据
 *
 *
 * */

const hasRow = function (table, field) {
    const where = jsonToStr(field)
    return !!global.db.exec(`select count(*) from '${table}' where ${where}`)[0].values[0][0]

}





module.exports = {
    conn,
    join,
    end,
    query,
    run,
    create,
    insert,
    update,
    del,
    column,
    hasTable,
    hasRow,
}

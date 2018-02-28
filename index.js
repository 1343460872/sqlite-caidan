

const db = require('./lib/sqlite-encapsulation')

const createDb = () => {
    db.create('all_group', [
        'id',
        {text: ['group_name', 'group_id']}
    ])
    console.log('createDb')
}

db.conn('db/test', ( hasDb ) => {
    //创建关系表，存储每个学员与组的关系
    if(!hasDb){
        createDb()
    }

})





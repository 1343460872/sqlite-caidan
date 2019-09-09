

const db = require('../index')

const createDb = () => {
    db.create('all_group2', [
        'id',
        {text: ['group_name', 'group_id']}
    ])
    console.log('createDb')
}
db.conn('../db/test', ( hasDb ) => {
    if(!hasDb){
        //创建关系表，存储每个学员与组的关系
        createDb()
    }
});





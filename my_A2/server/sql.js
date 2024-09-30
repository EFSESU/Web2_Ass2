module.exports = {
    //查询活动类别名称 Search for activity category names
    fundraiserList: `select fundraiser.*, category.name as category_name
                                from fundraiser
                                join category on fundraiser.category_id = category.category_id
                                where (fundraiser.category_id = ? or ? is null)
                                and (fundraiser.organizer = ? or ? is null)
                                and (fundraiser.city = ? or ? is null)
                                and (fundraiser.active = 1)`,
    //查询组织者
    organizer: 'select organizer from fundraiser',
    //查询城市
    city: 'select city from fundraiser',
    //查询类别
    category: 'select * from category',
    detail: `select fundraiser.*, category.name as category_name
                                from fundraiser
                                join category on fundraiser.category_id = category.category_id
                                where fundraiser.fundraiser_id = ?`
}
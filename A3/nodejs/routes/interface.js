//分页查询用户
const getPerson = (conn, req, res) =>{
	const params = req.body;
	const ret = {
		data: {
			page: params.page,
			limit: params.limit,
			total: null,
			data: null,
		}
	}
	let sql;
	// if(params.conditions.name) sql = `SELECT * FROM t_person ${params.conditions.name ? 'WHERE'} WHERE name=${req.body.conditions.name} LIMIT ${(params.page - 1)*params.limit},${params.limit}`;
	sql = `SELECT * FROM t_person ${objTostr(params.conditions,' AND ').length > 0 ? 'WHERE ' +  objTostr(params.conditions,' AND '): ''} LIMIT ${(params.page - 1)*params.limit},${ params.limit}`;
	console.log(sql);
	conn.query(`SELECT COUNT(*) FROM t_person ${objTostr(params.conditions,' AND ').length > 0 ? 'WHERE ' +  objTostr(params.conditions,' AND '): ''}`,(error, results, fields) =>{
		// console.log(results);
		// console.log(`SELECT COUNT(*) FROM t_person ${objTostr(params.conditions,' AND ').length > 0 ? 'WHERE ' +  objTostr(params.conditions,' AND '): ''} LIMIT ${(params.page - 1)*params.limit},${ params.limit}`);
		ret.data.total = results[0]['COUNT(*)']
	})
	conn.query(sql,
	    function (error, results, fields) {
			console.log(fields);
	    if (error) {
	        ret.code = 500
	        ret.data = null
	        ret.msg = error.sqlMessage
	        return
	    }
	    if (results.length === 0) {
	        ret.code = 501
	        ret.message = '请传递正确的参数'
	    } else {
	        ret.code = 200
	        ret.data.data = results
	        ret.msg = '查询成功'
	    }
	    res.json(ret)
	})
}

// 添加用户
const addPerson = (conn, req, res) => {
    const params = req.body
	console.log(params);
		console.log(typeof params.age);
    // console.log(params);
    const ret = {}
    if (!params.name || params.name == '') {
        ret.code = 501
        ret.data = null
        ret.msg = '请输入姓名'
        res.json(ret)
        return
    } else if (!params.age || params.name == '') {
        ret.code = 501
        ret.data = null
        ret.msg = '请输入正确的年龄'
        res.json(ret)
        return
    } else {
        conn.query(`INSERT INTO t_person(name,age,school,id)VALUES('${params.name || ""}','${params.age || ""}','${params.school || ""}','${randomId()}')`,
        // conn.query(`INSERT INTO t_person(name,age,school)VALUES('${params.name}','${params.age}','${params.school}')`,
            function (error, results, fields) {
            if (error) {
                ret.code = 500
                ret.data = null
                ret.msg = error.sqlMessage
                return
            }
            if (results.length === 0) {
                ret.code = 501
                ret.message = '请传递正确的参数'
            } else {
                ret.code = 200
                ret.data = null
                ret.msg = '添加成功'
            }
            res.json(ret)
        })
    }
}

const randomId = function uuid(){
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });		
}

const objTostr = function (conditions,symbol) {  
  let parts = [];  
  // 遍历对象的每个属性  
  for (let key in conditions) {  
    // 检查属性值是否有效（非空且非undefined）  
    if (conditions[key]) {  
      // 将属性名和属性值添加到parts数组中  
      parts.push(`${key} LIKE '%${conditions[key]}%'`);  
    }  
  }  
  // 如果parts数组为空，则返回空字符串  
  if (parts.length === 0) {  
    return '';  
  }  
  // 使用join方法将数组中的字符串用' and '连接起来  
  return parts.join(symbol);  
}

// 修改用户
const updatePerson = (conn, req, res) => {
    const params = req.body
    // console.log(params);
    const ret = {}
    if (params.name == '') {
        ret.code = 501
        ret.data = null
        ret.msg = '请传递姓名'
        res.json(ret)
        return
    } else if (params.age == '') {
        ret.code = 501
        ret.data = null
        ret.msg = '请输入姓名'
        res.json(ret)
        return
    } else if (params.school == '') {
        ret.code = 501
        ret.data = null
        ret.msg = '请输入学校'
        res.json(ret)
        return
    } else {
        conn.query(`UPDATE t_person SET 
        name="${params.name}",
        age="${params.age}",
        school="${params.school}" WHERE id="${params.id}";`,
            function (error, results, fields) {
                if (error) {
                    ret.code = 500
                    ret.data = null
                    ret.msg = error.sqlMessage
                    return
                }
                if (results.length === 0) {
                    ret.code = 501
                    ret.message = '请传递正确的参数'
                } else {
                    ret.code = 200
                    ret.data = null
                    ret.msg = '修改成功'
                }
                res.json(ret)
            })
    }
}

// 删除用户
const deletePerson = (conn, req, res) => {
    console.log(req.query);
    const params = req.query;
    const ret = {}
    if (params.id == '') {
        ret.code = 501
        ret.data = null
        ret.msg = '请传递id'
        res.json(ret)
        return
    } else { 
		//post多条删除sql   DELETE FROM t_person WHERE id IN ("1","2")
		let sql = `DELETE FROM t_person WHERE id="${params.id}"`;
        conn.query(sql,
            function (error, results, fields) {
                // console.log(error);
                if (error) {
                    ret.code = 500
                    ret.data = null
                    ret.msg = error.sqlMessage
                    return
                }
                if (results.length === 0) {
                    ret.code = 501
                    ret.message = '请传递正确的参数'
                } else {
                    ret.code = 200
                    ret.data = null
                    ret.msg = '删除成功'
                }
                res.json(ret)
            })
    }
}

// 用户详情
const detailPerson = (conn, req, res) => {
    console.log(req.query);
    const params = req.query;
    const ret = {}
    if (params.id == '') {
        ret.code = 501
        ret.data = null
        ret.msg = '请传递id'
        res.json(ret)
        return
    } else { 
        conn.query(`SELECT * FROM t_person WHERE id="${params.id}";`,
            function (error, results, fields) {
                // console.log(error);
                if (error) {
                    ret.code = 500
                    ret.data = null
                    ret.msg = error.sqlMessage
                    return
                }
                if (results.length === 0) {
                    ret.code = 501
                    ret.message = '请传递正确的参数'
                } else {
                    ret.code = 200
                    ret.data = results[0]
                    ret.msg = '查询成功'
                }
                res.json(ret)
            })
    }
}

//最后exports
module.exports = {
	getPerson,
	updatePerson,
	addPerson,
	deletePerson,
	deletePerson,
}

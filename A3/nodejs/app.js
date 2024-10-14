var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var fundraiserRouter = require('./routes/Fundraiser');
var adminRouter = require('./routes/admin');
var addadminRouter = require('./routes/addadmin');
var searchRouter = require('./routes/search');
var mainRouter = require('./routes/main');
var ownationRouter = require('./routes/ownation');
var db = require('./routes/db.js')

var app = express();
app.use(cors())  
// view engine setup
app.engine('html',require('express-art-template'))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/Fundraiser', fundraiserRouter);
app.use('/admin', adminRouter);
app.use('/addadmin', addadminRouter);
app.use('/search', searchRouter);
app.use('/main', mainRouter);
app.use('/ownation', ownationRouter);
//定义接口

app.get('/api', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT FUNDRAISER.FUNDRAISE_ID, ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, FUNDRAISER.CATEGORY_ID, CATEGORY.NAME AS CATEGORY_NAME FROM FUNDRAISER INNER JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID');
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Route to get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM CATEGORY');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Route to search fundraisers
app.get('/api/search', async (req, res) => {
  let query = 'SELECT FUNDRAISER.FUNDRAISE_ID, ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, FUNDRAISER.CATEGORY_ID, CATEGORY.NAME AS CATEGORY_NAME FROM FUNDRAISER INNER JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID WHERE 1=1';
  if (req.query.organizer) {
    query += ` AND ORGANIZER LIKE '%${req.query.organizer}%'`;
  }
  if (req.query.city) {
    query += ` AND CITY LIKE '%${req.query.city}%'`;
  }
  if (req.query.CATEGORY_ID) {
    query += ` AND FUNDRAISER.CATEGORY_ID = '${req.query.CATEGORY_ID}'`;
  }

  try {
    const [rows] = await db.query(query);
    if (rows.length === 0) {
      res.json(null);
    } else {
      res.json(rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Route to get detailed information for a specific fundraiser
app.get('/api/fundraiser/:id', async (req, res) => {
  try {
    const [row] = await db.query('SELECT * FROM FUNDRAISER WHERE FUNDRAISE_ID = ?', [req.params.id]);
    if (row.length === 0) {
      res.status(404).send('Fundraiser not found');
    } else {
      res.json(row[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 获取筹款活动详细信息（包括捐款列表）
app.get('/api/fundraisers/:id', async (req, res) => {
  const fundraiserId = req.params.id;

  try {
    // 获取筹款活动信息
    const [fundraiserRows] = await db.execute('SELECT * FROM fundraiser WHERE FUNDRAISE_ID = ?', [fundraiserId]);
    if (fundraiserRows.length === 0) {
      return res.status(404).json({ message: 'Fundraiser not found' });
    }

    // 获取捐款列表
    const [donationRows] = await db.execute('SELECT * FROM donation WHERE fundraiser_id = ?', [fundraiserId]);

    res.json({
      fundraiser: fundraiserRows[0],
      donations: donationRows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {

  }
});

// 插入新的捐款
app.post('/api/donation', async (req, res) => {
  const { date, amount, giver_name, fundraiser_id } = req.body;
  console.log(req.body)

  try {
    const [result] = await db.execute(
      'INSERT INTO donation (date, amount, giver_name, fundraiser_id) VALUES (?, ?, ?, ?)',
      [date, amount, giver_name, fundraiser_id]
    );
    res.status(201).json({ message: 'Donation created', donation_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
  }
});

// 插入新的筹款活动
app.post('/api/fundraiser', async (req, res) => {
  const { ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID } = req.body;

  try {
    const [result] = await db.execute(
      'INSERT INTO fundraiser (ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID]
    );
    res.status(201).json({ message: 'Fundraiser created', fundraiser_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
  }
});

// 更新现有的筹款活动
app.put('/api/fundraiser/:id', async (req, res) => {
  const fundraiserId = req.params.id;
  const { ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE fundraiser SET ORGANIZER = ?, CAPTION = ?, TARGET_FUNDING = ?, CURRENT_FUNDING = ?, CITY = ?, ACTIVE = ?, CATEGORY_ID = ? WHERE FUNDRAISE_ID = ?',
      [ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID, fundraiserId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Fundraiser not found' });
    }
    res.json({ message: 'Fundraiser updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {

  }
});

// 删除现有的筹款活动（只有没有捐款的筹款活动才能被删除）
app.delete('/api/fundraiser/:id', async (req, res) => {
  const fundraiserId = req.params.id;

  try {
    // 检查是否有捐款
    const [donationRows] = await db.execute('SELECT * FROM donation WHERE fundraiser_id = ?', [fundraiserId]);
    if (donationRows.length > 0) {
      return res.status(400).json({ message: 'Cannot delete fundraiser with donations' });
    }

    // 删除筹款活动
    const [result] = await db.execute('DELETE FROM fundraiser WHERE FUNDRAISE_ID = ?', [fundraiserId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Fundraiser not found' });
    }
    res.json({ message: 'Fundraiser deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {

  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

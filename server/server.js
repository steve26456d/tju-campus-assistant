const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'test'; // 用于JWT签名的密钥

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 模拟数据库
const mockData = {
  // 学生账号信息 (用于登录验证)
  students: [
    { id: '2021001', password: 'password1', name: '张三', major: '计算机科学与技术' },
    { id: '2021002', password: 'password2', name: '李四', major: '电子信息工程' }
  ],
  
  // 课程表数据
  schedules: {
    '2021001': [
      {
        courseName: '高等数学',
        teacher: '张教授',
        location: '同济大学(嘉定校区)-安楼',
        classroom: 'A203',
        weekday: 1,
        startPeriod: 1,
        endPeriod: 2,
        weeks: "1-16周",
      },
      {
        courseName: '大学物理',
        teacher: '李教授',
        location: '同济大学(嘉定校区)-博楼',
        classroom: "B205",
        weekday: 2,
        startPeriod: 3,
        endPeriod: 4,
        weeks: "1-16周",
      },
      {
        courseName: '程序设计',
        teacher: '王老师',
        location: '同济大学(嘉定校区)-广楼',
        classroom: 'G301',
        weekday: 3,
        startPeriod: 5,
        endPeriod: 6,
        weeks: "1-16周",
      },
      {
        courseName: '英语',
        teacher: '陈老师',
        location: '同济大学(嘉定校区)-复楼',
        classroom: 'F204',
        weekday: 4,
        startPeriod: 1,
        endPeriod: 2,
        weeks: "1-16周",
      },
      {
        courseName: '体育',
        teacher: '赵老师',
        location: '嘉定同济体育中心',
        classroom: '中心体操房114',
        weekday: 5,
        startPeriod: 7,
        endPeriod: 8,
        weeks: "1-16周",
      },
    ],
    '2021002': [
      {
        courseName: '线性代数',
        teacher: '刘教授',
        location: '同济大学(嘉定校区)-安楼',
        classroom: 'A201',
        weekday: 1,
        startPeriod: 3,
        endPeriod: 4,
        weeks: "1-16周",
      },
      {
        courseName: '电路原理',
        teacher: '黄教授',
        location: '同济大学(嘉定校区)-复楼',
        classroom: 'F206',
        weekday: 2,
        startPeriod: 1,
        endPeriod: 2,
        weeks: "1-16周",
      },
      {
        courseName: '体育-篮球',
        teacher: '吴老师',
        location: '篮球场',
        classroom: '同济大学嘉定校区篮球场',
        weekday: 3,
        startPeriod: 3,
        endPeriod: 4,
        weeks: "1-16周",
      }
    ]
  },
  
  // 一卡通流水数据
  cardHistories: {
    '2021001': {
      balance: 328.56,
      transactions: [
        {
          id: 1,
          type: "expense",
          amount: 12.5,
          location: "第一食堂",
          time: "2025-01-20 12:30:45",
          balance: 328.56,
          category: "餐饮",
        },
        {
          id: 2,
          type: "expense",
          amount: 8.0,
          location: "第二食堂",
          time: "2025-01-20 18:15:22",
          balance: 341.06,
          category: "餐饮",
        },
        {
          id: 3,
          type: "expense",
          amount: 2.5,
          location: "图书馆打印室",
          time: "2025-01-19 14:20:10",
          balance: 349.06,
          category: "打印",
        },
        {
          id: 4,
          type: "income",
          amount: 200.0,
          location: "在线充值",
          time: "2025-01-19 10:00:00",
          balance: 351.56,
          category: "充值",
        },
        {
          id: 5,
          type: "expense",
          amount: 15.0,
          location: "校园超市",
          time: "2025-01-18 16:45:30",
          balance: 151.56,
          category: "购物",
        }
      ]
    },
    '2021002': {
      balance: 156.20,
      transactions: [
        {
          id: 1,
          type: "expense",
          amount: 10.0,
          location: "第三食堂",
          time: "2025-01-20 12:15:30",
          balance: 156.20,
          category: "餐饮",
        },
        {
          id: 2,
          type: "income",
          amount: 100.0,
          location: "在线充值",
          time: "2025-01-19 09:30:00",
          balance: 166.20,
          category: "充值",
        }
      ]
    }
  }
};

// 登录接口
app.post('/api/tongji/auth/login', (req, res) => {
  const { studentId, password } = req.body;
  
  // 查找学生
  const student = mockData.students.find(
    s => s.id === studentId && s.password === password
  );
  
  if (student) {
    // 生成JWT令牌
    const token = jwt.sign(
      { studentId: student.id },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    res.json({ token });
  } else {
    res.status(401).json({ error: '用户名或密码错误' });
  }
});

// 获取学生信息接口
app.get('/api/tongji/v2/dc/user/student_infos', authenticateToken, (req, res) => {
  const student = mockData.students.find(s => s.id === req.studentId);
  
  if (student) {
    res.json({
      studentId: student.id,
      name: student.name,
      major: student.major,
      // 可以添加更多学生信息
    });
  } else {
    res.status(404).json({ error: '学生信息未找到' });
  }
});

// 获取课程表接口
app.get('/api/tongji/v1/rt/onetongji/student_timetable', authenticateToken, (req, res) => {
  // 忽略week参数，返回该学生的所有课程
  res.json({
    courses: mockData.schedules[req.studentId] || []
  });
});

// 获取一卡通流水接口
app.get('/api/tongji/v1/dc/card/card_history_flow', authenticateToken, (req, res) => {
  // 忽略range参数，返回该学生的所有流水
  const history = mockData.cardHistories[req.studentId] || { balance: 0, transactions: [] };
  res.json(history);
});

// 认证中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: '未提供令牌' });
  }
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '令牌无效' });
    }
    
    req.studentId = user.studentId;
    next();
  });
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`模拟后端服务已启动，运行在 http://localhost:${PORT}`);
});
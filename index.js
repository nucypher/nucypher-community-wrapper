const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;
const agrees = [];

app.use(cookieParser());

app.post('/api/agree', (req, res) => {
  const agreeGenerated = Math.random().toString(36).substring(2, 15);
  agrees.push(agreeGenerated);
  res.status(200).cookie('token', agreeGenerated, {
    expires: new Date(Date.now() + (8 * 60 * 60 * 1000)) // agree for 8 hours
  }).send({
    status: 'OK'
  });
});

const staticMiddleware = express.static('hosted');
app.use('/', (req, res, next) => {
  const sendFileOptions = {
    root: __dirname,
    dotfiles: 'deny'
  };
  const tokenCookie = req.cookies['token'];
  if (tokenCookie && agrees.indexOf(tokenCookie) >= 0) {
    staticMiddleware(req, res, next);
  } else {
    res.sendFile('./index.html', sendFileOptions);
  }
});

app.listen(port, () => {
  console.log(`App running on ${port}`);
});

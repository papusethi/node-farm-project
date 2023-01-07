const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////////////////////////////////////////////////////////////////////////
// FILES

// Synchronous Code

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now().toLocaleString()}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

// Asynchronous Code
// const textIn = fs.readFile("./txt/input.txt", "utf-8", (error, data) => {
//   console.log(data);
// });
// console.log("Reading file...");

////////////////////////////////////////////////////////////////////////////////////////////
// SERVER

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const slugs = dataObj.map((item) => slugify(item.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, 'OK', { 'Content-type': 'text/html' });
    const cardsHtml = dataObj.map((item) => replaceTemplate(templateCard, item)).join('');

    const output = templateOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    res.writeHead(200, 'OK', { 'Content-type': 'text/html' });
    const output = replaceTemplate(templateProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.end(data);

    // Not Found
  } else {
    res.writeHead(404, 'Not Found', {
      'Content-type': 'text/html',
      'my-own-header': 'hello world'
    });
    res.end('<h1>Page Not Found !!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server is listening...');
});

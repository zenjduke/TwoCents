# TwoCents
A web app that lets users view and leave comments on the latest news.

Whenever a user runs the app on the local server or on the heroku app link, article headlines, the article link, and the article snippet are scraped from The New York Times' website.

Cheerio is used to easily grab and scrape NYT's DOM elemnts. Mongoose is used to save the scraped data to our database (mongodb.)

The comments button allows user to view comments on an article or add/delete their own comments; all comments are saved to our mongodb database.

See it live here: #

## Prerequisites

Install Node.js. visit https://nodejs.org/en/ and download
Technologies used
*node.js *Express.js *Bootstrap V4

## Getting Started

This app was made possible using the following npm packages:

express
express-handlebars
body-parser
cheerio
mongoose
morgan
request

Type npm install in the command line to install all the dependcies located within package.json

Default test (included in package.json file)
In order to connect to the scraper web app on the local server, type the following in the command line:
```
node server.js
```

The user will also be notified in the command line interface on which PORT its connected on.

## Author
Zenna Duke

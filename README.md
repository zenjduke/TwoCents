# TwoCents

## Overview

TwoCents is a scraper app which captures the title, summary and image of articles from The New York Times politics section. Users can save articles and add and edit notes for each article.

Visit TwoCents here:

https://dashboard.heroku.com/apps/safe-waters-64599

## Key Dependencies

request: enables cheerio to get access to front-end code of https://www.nytimes.com/section/world

cheerio: scrapes front-end code from https://www.nytimes.com/section/world

mongoose: be in charge of database of NYT Scraper

express: builds server-side routes and functions

morgan: logs server-side requests, helping debugging

express-handlebars: a powerful front-end builder without requiring multiple html pages

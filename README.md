# Largest_Image_Webpage_BackEnd

This is the backend of the project Largest image webpage. 

## The goal of this project is to traverse adn save the largest image from any given website.

The application expose RESTful APIs, the API allows the following functionality:\
CRUD services for jobs, each job describing the URL to scrape and results of the job. 
The application is able to handle multiple URLs that need to be scraped.\
Trigger a new scrape\
Identify whether a scrape is complete or in progress \
Retrieve the largest image for any given scraped URL (to be selected by the caller of the API\
Leverage a database (whichever you are most familiar with).\
Scrape http & https URLs.\

## The frontend should be a single page application with the following:
a list of URL scrapes (both in progress and complete)\
clicking one scrape should display details of the scrape:\
URL\
start date time\
status\
largest image regardless of whether in progress or complete\
text field to submit a new URL scrape and the new URL scrape should appear in the in progress list\

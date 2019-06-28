const express = require("express");
const URL = require('../models/url'); // mongo
const axios = require("axios");
const cheerio = require("cheerio");
const imageSize = require("image-size");
const urlparser = require('url');
const http = require('http');
const https = require('https');

router = express.Router();

// url is the inputUrl to make RESTful request
router.post("/submit", async (req, res) => {
    const { url } = req.body;
    // find one url thats already exists in the URL
    const query = URL.findOne({ inputUrl: url }).exec(); 
    //wait for this code to finish before continueing 
    await query.then(response => { // response is the result of the query 
        let save;
        const userUrl = response;
        if (!userUrl) {
            save = new URL({
                inputUrl: url, // the url from the request body 
                status: false, // when the first time send, initialize it as false 
                outputUrl: {}
            }).save(); // to save to the db 
        } else {
            userUrl.status = false; // if the url exsit, then update the url 
            save = userUrl.save();
        }
        save
            .then((data) => {
                console.log("saved ", data)
            })
            .error((err) => {
                console.log("error ", err)
            });
    })

    let getData = (html) => {
        data = [];
        const $ = cheerio.load(html); // allows to use jQuery on the html
        $('img').each((i, elem) => {
            data.push($(elem).attr("src")); // putting all images srcs into data
        });
        data.map(image => {
            // url is the input 
            const imageUrl = image.charAt(0) === "/" ? (`${url}${image}`) : image;
            const options = urlparser.parse(imageUrl); // give object that can be parsed 
            if (options.protocol === "https:") {
                https.get(options, function (response) { // callback take the result of the get request
                    const chunks = [];
                    response.on('data', function (chunk) {
                        chunks.push(chunk);
                    }).on('end', async function () {
                        const buffer = Buffer.concat(chunks);
                        
                        const dimensions = imageSize(buffer);
                        const total = dimensions.width * dimensions.height;
                        const myUrl = await URL.findOne({ inputUrl: url }); // find an object form the db to update
                        if (myUrl.outputUrl.url === undefined) {
                            myUrl.update({
                                outputUrl: {
                                    url: imageUrl,
                                    size: total
                                }
                            }).then(response => {
                                console.log(response);
                            });
                        } else {
                            if (myUrl.outputUrl.size < total) {
                                console.log('larger')
                                myUrl.update({
                                    outputUrl: {
                                        url: imageUrl,
                                        size: total
                                    }
                                }).then(response => {
                                    console.log(response);
                                });
                            }
                        }
                    });
                });
            } else {
                http.get(options, function (response) {
                    const chunks = [];
                    response.on('data', function (chunk) {
                        chunks.push(chunk);
                    }).on('end', async function () {
                        const buffer = Buffer.concat(chunks);
                        const dimensions = imageSize(buffer);
                        const total = dimensions.width * dimensions.height;
                        const myUrl = await URL.findOne({ inputUrl: url });
                        if (myUrl.outputUrl.url === undefined) {
                            myUrl.update({
                                outputUrl: {
                                    url: imageUrl,
                                    size: total
                                }
                            }).then(response => {
                                console.log(response);
                            });
                        } else {
                            if (myUrl.outputUrl.size < total) {
                                console.log('larger')
                                myUrl.update({
                                    outputUrl: {
                                        url: imageUrl,
                                        size: total
                                    }
                                }).then(response => {
                                    console.log(response);
                                });
                            }
                        }
                    });
                });
            }
        })
    }

    await axios.get(url) // making a get request to the input url --> return html
        .then(response => {
            getData(response.data); // parse the html and put the largest image into db
        })
        .catch(error => {
            console.log(error);
        });

    await URL.findOne({ inputUrl: url })
        .then(url => {
            url.status = true;
            url.save()
                .then(final => { // final is the completed object
                    return res.json({ url: final });
                })
        })
})

router.get("/loadtable", (req, res) => {
    return URL.find({}) // return from db , get the b
        .then((data) => { // data is whatever being returned from the db , preprare it
            return res.json({ urls: data }) // urls is the key, returned data from db is the value 
        })
        .error(err => {
            console.log(err)
        })
})

module.exports = router;

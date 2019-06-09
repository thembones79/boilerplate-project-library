/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var mongo = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var url = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
  app
    .route("/api/books")
    .get(function(req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      mongo.connect(url, { useNewUrlParser: true }, function(err, client) {
        var db = client.db("love");
        if (err) throw err;
        var collection = db.collection("library");
        collection.find({}, { title: 1 }).toArray(function(err, docs) {
          if (err) console.log(err);

          function countComments(item) {
            var commentCountInsteadOfComments = {
              _id: item._id,
              title: item.title,
              commentcount: item.comments.length
            };
            return commentCountInsteadOfComments;
          }

          res.json(docs.map(countComments));
          client.close();
        });
      });
    })

    .post(function(req, res) {
      var title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (!title) {
        res.send("no input");
      } else {
        var book = { title, comments: [] };

        mongo.connect(url, { useNewUrlParser: true }, function(err, client) {
          var db = client.db("love");
          if (err) throw err;
          var collection = db.collection("library");
          collection.insertOne(book, function(err, data) {
            if (err) throw err;

            res.json(data.ops[0]);
            client.close();
          });
        });
      }
    })

    .delete(function(req, res) {
      //if successful response will be 'complete delete successful'
      mongo.connect(url, { useNewUrlParser: true }, function(err, client) {
        var db = client.db("love");
        if (err) throw err;
        var collection = db.collection("library");
        collection.remove();
        res.send("complete delete successful");
        client.close();
      });
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if (bookid.length !== 24) {
        res.send("no book exists");
      } else {
        mongo.connect(url, { useNewUrlParser: true }, function(err, client) {
          var db = client.db("love");
          if (err) throw err;
          var collection = db.collection("library");
          collection
            .find({ _id: ObjectId(bookid) })
            .toArray(function(err, docs) {
              if (err) console.log(err);

              if (docs.length === 0) {
                res.send("no book exists");
                client.close();
              } else {
                res.json(docs[0]);
                client.close();
              }
            });
        });
      }
    })

    .post(function(req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get

      var book = req.body;

      if (!comment) {
        res.send("no updated field sent");
      } else {
        mongo.connect(url, { useNewUrlParser: true }, function(err, client) {
          var db = client.db("love");
          if (err) throw err;
          var collection = db.collection("library");

          collection.findOneAndUpdate(
            {
              _id: ObjectId(bookid)
            },
            {
              $push: { comments: comment }
            },
            { upsert: true },
            function(err, data) {
              if (err) {
                res.send("could not update " + bookid);
                client.close();
              } else {
                //console.log(data.value);
                res.send(data.value);
                client.close();
              }
            }
          );
        });
      }
    })

    .delete(function(req, res) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'

      if (!bookid) {
        res.send("_id error");
      } else {
        mongo.connect(url, { useNewUrlParser: true }, function(err, client) {
          var db = client.db("love");
          if (err) throw err;
          var collection = db.collection("library");

          collection.deleteOne(
            {
              _id: ObjectId(bookid)
            },
            function(err, data) {
              if (err) {
                res.send("could not delete " + bookid);
                client.close();
              } else {
                res.send("delete successful");
                client.close();
              }
            }
          );
        });
      }
    });
};

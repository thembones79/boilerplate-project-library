/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function(done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function() {
    var id;

    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "The Shining" })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.property(
                res.body,
                "comments",
                "Book should contain comments"
              );
              assert.isArray(res.body.comments, "Comments should be an array");
              assert.property(res.body, "title", "Book should contain title");
              assert.property(res.body, "_id", "Book should contain _id");
              assert.equal(res.body.title, "The Shining");
              done();
            });
        });

        test("Test POST /api/books with no title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, "no input");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
            id = res.body[0]._id;
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with unknown id", function(done) {
        chai
          .request(server)
          .get("/api/books/543218870923")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id", function(done) {
        chai
          .request(server)
          .get("/api/books/" + id)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(
              res.body,
              "comments",
              "Book should contain comments"
            );
            assert.isArray(res.body.comments, "Comments should be an array");
            assert.property(res.body, "title", "Book should contain title");
            assert.property(res.body, "_id", "Book should contain _id");
            assert.equal(res.body._id, id);
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", function(done) {
          chai
            .request(server)
            .post("/api/books/" + id)
            .send({ comment: "best book" })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.property(
                res.body,
                "comments",
                "Book should contain comments"
              );
              assert.isArray(res.body.comments, "Comments should be an array");
              assert.include(
                res.body.comments,
                "best book",
                "Comments should include best book comment"
              );
              assert.property(res.body, "title", "Book should contain title");
              assert.property(res.body, "_id", "Book should contain _id");
              done();
            });
        });
      }
    );
  });
});

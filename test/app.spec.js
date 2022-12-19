// import sinon from "sinon";
// import { expect } from "chai";
import sinonChai from "sinon-chai";
import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import server from "../src/index.js";
import Blog from "../src/database/blogsModal.js";
import User from "../src/database/userModal.js";
import { readFile } from "fs";

const should = chai.should();

chai.use(sinonChai);
chai.use(chaiHttp);

describe("@# test server", () => {
  beforeEach((done) => {
    Blog.deleteMany({}, (err) => {
      done();
    });
  });
  describe("# Testing GET /api/v1/blogs/ ", () => {
    it("get all blogs", (done) => {
      chai
        .request(server)
        .get("/api/v1/blogs")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
    it("get single blog", (done) => {
      chai
        .request(server)
        .get("/api/v1/blogs/639b5a2d1582ae895cd52516")
        .end((err, res) => {
          res.should.have.status(200);
          // res.body.should.be.a("object");
          // res.body.length.should.be.eql(0);
          done();
        });
    });
    it("# Testing POST /api/v1/blogs/", (done) => {
      readFile("./test/blog.json", "utf8", (err, data) => {
        if (err) console.log(err);
        chai
          .request(server)
          .post("/api/v1/blogs")
          .set(
            "Authorization",
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOWM1ZWJhNDI2OTA0MjA1OGEzODYxMSIsImlhdCI6MTY3MTE5MjQ3MiwiZXhwIjoxNjcxNjI0NDcyfQ.7DC457s9vSVp8ZUml2niQCl6qgsLqsOI3Wyy1HHWDbw"
          )
          .send(JSON.parse(data))
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("created a blog successfully");
            res.body.should.have.property("data");
            done();
          });
      });
    });
    it("# Testing PUT /api/v1/blogs:blogid", (done) => {
      readFile("./test/update_blog_title.json", "utf8", (err, data) => {
        if (err) console.log(err);
        chai
          .request(server)
          .put("/api/v1/blogs/639c10ef4717ef4e70bf30ab")
          .set(
            "Authorization",
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOWM1ZWJhNDI2OTA0MjA1OGEzODYxMSIsImlhdCI6MTY3MTE5MjQ3MiwiZXhwIjoxNjcxNjI0NDcyfQ.7DC457s9vSVp8ZUml2niQCl6qgsLqsOI3Wyy1HHWDbw"
          )
          .send(JSON.parse(data))
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("updated a blog successfully");
            res.body.should.have.property("data");
            done();
          });
      });
    });
    it("# Testing DELETE /api/v1/blogs:blogId", (done) => {
      chai
        .request(server)
        .delete("/api/v1/blogs/639c10ef4717ef4e70bf30ab")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOWM1ZWJhNDI2OTA0MjA1OGEzODYxMSIsImlhdCI6MTY3MTE5MjQ3MiwiZXhwIjoxNjcxNjI0NDcyfQ.7DC457s9vSVp8ZUml2niQCl6qgsLqsOI3Wyy1HHWDbw"
        )
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("deleted a blog successfully");
          res.body.should.have.property("data");
          done();
        });
    });
  });
});

describe("@# Testing /api/v1/auth/", () => {
  it("signup the user", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/signup")
      .send({
        email: "muslimuwitondanishemauwit@gmail.com",
        password: "lorem12345",
        userName: "muslimuwitondanishemauwit",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.data.should.have.property("token");
        done();
      });
  });
  it("login the user", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/login")
      .send({
        email: "muslimuwitondanishemauwit@gmail.com",
        password: "lorem12345",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("token");
        done();
      });
  });
});

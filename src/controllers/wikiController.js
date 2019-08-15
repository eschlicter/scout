const wikiQueries = require('../db/queries.wikis.js');
const Authorizer = require('../policies/application');
const markdown = require( "markdown" ).markdown;


module.exports = {

  index(req, res, next){
    wikiQueries.getAllWikis((err, wikis) => {
      if(err){
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/index", {wikis});
      }
    })
  },

  indexPrivate(req, res, next){
    wikiQueries.getAllWikis((err, wikis) => {
      if(err){
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/indexPrivate", {wikis});
      }
    })
  },

  new(req, res, next){
    const authorized = new Authorizer(req.user).new();
    if(authorized) {
      res.render("wikis/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },

  create(req, res, next){
    const authorized = new Authorizer(req.user).create();
    if(authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: req.body.private,
        userId: req.user.id,
        collaborator: req.body.collaborator
      };
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if(err){
          res.redirect(500, "wikis/new");
        } else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },

  show(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, result) => {
      wiki = result["wiki"];
      if(err || wiki == null){
        console.log(collaborators);
        res.redirect(404, "/");
      } else {
        wiki.body = markdown.toHTML(wiki.body);
        res.render("wikis/show", {wiki});
      }
    });
  },

  edit(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, result) => {
      if(err || result == null){
        console.log("wikiController1  "+err);
        console.log("wikiController2  "+collaborator);
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, wiki).edit();
        if(authorized){
          res.render("wikis/edit", {...result});
        } else {
          req.flash("You are not authorized to do that.")
          res.redirect(`/wikis/${req.params.id}`)
        }
      }
    });
  },

  update(req, res, next){
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if(err || wiki == null){
        console.log(err)
        res.redirect(401, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  },

  destroy(req, res, next){
    wikiQueries.deleteWiki(req, (err, wiki) => {
      if(err){
        res.redirect(err, `/wikis/${req.params.id}`)
      } else {
        res.redirect(303, "/wikis")
      }
    });
  }

}

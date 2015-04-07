/**
 * dak0rn.github.com
 *
 * Awesome SPA stuff
 */
(function(Backbone, Marionette, $, _){

    // Classes
    var Post = Backbone.Model.extend({

        defaults: {
            title: '',
            contents: '',
            date: '',
            basename: ''
        },

        url: function() {
            return 'release/articles/' + this.get('basename') + '.html';
        },

        loadPost: function() {

            return $.get( this.url() )
                .done( _.bind(function(html) {
                    this.set('contents', html);
                }, this));

        }

    });

    var Posts = Backbone.Collection.extend({
        model: Post,
        comparator: function(model1, model2) {
            return model1.get('date') < model2.get('date');
        }
    });

    var ArticleView = Marionette.ItemView.extend({
        tagName: 'article',
        template: _.template('<div class="article-title"><a href="#post"><%=title%></a></div><div class="article-content"><%=contents%></div>'),
        triggers: {
            'click .article-title>a': 'show:single'
        },

        onRender: function() {
            this.$('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        }

    });

    var ArticlesView = Marionette.CollectionView.extend({
        tagName: 'section',
        childView: ArticleView
    });

    var NotFoundView = Marionette.ItemView.extend({
        template: _.template('<div class="nf-title">Not found</div><div class="nf-text">The requested page could not be found</div><img src="arrow.png" id="home-arrow" />'),
        tagName: 'div',
        className: 'nf'
    });

    var ControllerClass = Marionette.Object.extend({

        collection: null,

        showIndex: function() {

            $.get('release/posts.json')
                .done( _.bind(function(object) {

                    var posts = _.values(object);
                    this.collection = new Posts(posts);
                    var promises = [];

                    this.collection.each( function(post) {
                        promises.push( post.loadPost() );
                    });

                    $.when.apply($, promises)
                        .then( _.bind(function() {
                            var cview = new ArticlesView({collection: this.collection});

                            this.listenTo(cview, 'childview:show:single', _.bind(function(view, args){
                                var post = args.model.get('basename');
                                app.router.navigate('post/'+post);
                                app.trigger('show:post', post );
                            },this));
                            app.layout.getRegion('main').show(cview);
                        }, this));
                }, this));
        },

        showPost: function(what) {
            var post = null;
            var view = null;

            if( _.isObject(this.collection) )
                post = this.collection.where( {basename: what} );

            if( _.isArray(post) && post.length > 0 ) {
                view = new ArticleView({model: post[0]});
                app.layout.getRegion('main').show( view );
                $('body').scrollTop(0);
            }
            else {
                $.get('release/posts.json')
                    .done( _.bind(function(posts){
                        var t = posts[what];

                        if( _.isObject(t) ) {
                            var model = new Post(t);
                            model.loadPost().done(function(){
                                view = new ArticleView({model:model});
                                app.layout.getRegion('main').show( view );
                            });

                        }
                        else {
                            app.layout.getRegion('main').show( new NotFoundView() );
                        }



                    },this) );
            }


        }

    });

    // Instances

    var headerView = new (Marionette.ItemView.extend({
        template: _.template('<a class="nav-home" href="https://65535th.com">65535th</a> &middot; <a class="nav-projects" href="#projects">Projects</a>'),

        events: {
            'click .nav-home': 'home',
            'click .nav-projects': 'projects'
        },

        _navigate: function(event, url, trigger) {
            event.preventDefault();
            event.stopPropagation();
            app.router.navigate(url);
            app.trigger(trigger);
        },

        home: function(event) {
            this._navigate(event, '', 'show:index');
        },

        projects: function(event) {
            this._navigate(event, 'projects', 'show:projects');
        }
    }))();

    var app = new Marionette.Application();
    app.layout = new Marionette.LayoutView({
        el: 'body',

        regions: {
            'main': 'main',
            'header': 'header'
        }
    });



    var controller = new ControllerClass();

    app.router = new Marionette.AppRouter({
        controller: controller,

        appRoutes: {
            '': 'showIndex',
            'post/:basename': 'showPost'
        }
    });

    app.on('show:post', controller.showPost, controller);
    app.on('show:index', controller.showIndex, controller);


    app.on('start', function() {
        Backbone.history.start();

        app.layout.getRegion('header').show(headerView);
    });

    app.start();

})(Backbone, Marionette, $, _);
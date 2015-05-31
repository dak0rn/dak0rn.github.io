###
\++================================|                    _=_
 \_________________________________/               ___/==+++==\___
               """\__      \"""       |======================================/
                     \__    \_          / ..  . _/--===+_____+===--""
                        \__   \       _/.  .. _/         `+'
                           \__ \   __/_______/
                          ___-\_\-'---==+____|
                    __--+" .    . .        "==_
                    /  |. .  ..     -------- | \
                    "==+_    .   .  -------- | /
                         ""\___  . ..     __=="
                               """"--=--""
###

class Post extends Backbone.Model
    defaults:
        title: ''
        contents: ''
        date: ''
        basename: ''
        iso8601Date: ''
    
    url: -> "release/articles/#{@get 'basename'}.html"
    loadPost: ->
        @set 'date', new Date(@get 'iso8601Date'), silent:true
        p = $.get @url()
        p.done (html) => @set 'contents', html
        
        
class Posts extends Backbone.Collection
    model: Post
    comparator: (model1, model2) ->
        m1 = model1.get 'date'
        m2 = model2.get 'date'
        
        if m1 is m2
            0
        else if m1 < m2
            1
        else
            -1
            
class ArticleView extends Marionette.ItemView
    tagName: 'article'
    className: 'small'
    template: _.template '<div class="article-title"><a href="#post"><%=title%></a></div><div class="article-content"><%=contents%></div>'
    triggers:
        'click .article-title > a': 'show:single'
    
    onRender: ->
        @$('pre code').each (i,b) ->
            hljs?.highlightBlock? b
            
class ArticlesView extends Marionette.CollectionView
    tagName: 'section'
    className: 'small'
    childView: ArticleView
    
class NotFoundView extends Marionette.ItemView
    template: _.template '<div class="nf-title">Not found</div><div class="nf-text">The requested page could not be found</div><img src="arrow.png" id="home-arrow" />'
    tagName: 'section'
    className: 'nf small'
    
class Repository extends Backbone.Model
    defaults:
        id: ''
        updated_at: ''
        name: ''
        description: ''
        html_url: ''
        fork: true

class Repositories extends Backbone.Collection
    model: Repository
    url: 'https://api.github.com/users/dak0rn/repos'
    
    comparator: (a,b) ->
        k = a.get 'updated_at'
        l = b.get 'updated_at'
        
        if k is l
            0
        else if k < l
            1
        else
            -1
            
class RepositoryView extends Marionette.ItemView
    className: 'pr-row'
    template: _.template '<div class="pr-title"><a href="<%=html_url%>"><%=name%></a></div><div class="pr-text"><%=description%></div>'
    
class RepositoriesView extends Marionette.CompositeView
    childView: RepositoryView
    template: _.template '<div class="pr-large-title"><h1>Projects</h1></div><div class="projects"></div>'
    childViewContainer: '.projects'
    className: 'large'
    
class HeaderView extends Marionette.ItemView
    template: _.template '<a class="nav-home" href="https://65535th.com">65535th</a> &middot; <a class="nav-projects" href="#projects">Projects</a>'
    events:
        'click .nav-home': 'home',
        'click .nav-projects': 'projects'
        
    _navigate: (event, url, trigger) ->
        event.preventDefault()
        event.stopPropagation()
        app.router.navigate url
        app.trigger trigger
        
    home: (e) -> @_navigate e, '', 'show:index'
    projects: (e) -> @_navigate e, 'projects', 'show:projects'
    
class Controller extends Marionette.Object
    @collection: null
    @repos: null
    
    showIndex: ->
        def = $.get 'release/posts.json'
        
        def.done (object) =>
            posts = _.values object
            @collection = new Posts posts
            promises = []
            
            @collection.each (p) ->
                promises.push p.loadPost()
                
            p = $.when.apply $, promises
            p.done =>
                cview = new ArticlesView collection:@collection
                
                @listenTo cview, 'childview:show:single', (view, args) =>
                    post = args.model.get 'basename'
                    app.router.navigate "post/#{post}"
                    app.trigger 'show:post', post
                    
                app.layout.getRegion('main').show cview
                
                
    showPost: (what) ->
        post = null
        view = null
        
        post = @collection.where basename:what if @collection?
        
        # Lazy loading
        if _.isArray post && post.length
            view = new ArticleView model:post[0]
            app.layout.getRegion('main').show view
            $('body').scrollTop 0
        else
            p = $.get 'release/posts.json'
            p.done (posts) =>
                t = posts[what]
                
                if t?
                    model = new Post t
                    model.loadPost().done ->
                        view = new ArticleView model:model
                        app.layout.getRegion('main').show view
                else
                    app.layout.getRegion('main').show new NotFoundView
    
    showProjects: ->
        if @repos?
            view = new RepositoriesView collection: @repos
            app.layout.getRegion('main').show view
        else
            @repos = new Repositories
            p = @repos.fetch()
            p.done =>
                @repos = new Repositories @repos.where(fork:false)
                view = new RepositoriesView collection: @repos
                app.layout.getRegion('main').show view


## Let's go
controller = new Controller
app = new Marionette.Application

app.layout = new Marionette.LayoutView(
    el: 'body'
    regions:
        main: 'main'
        header: 'header'
)

app.router = new Marionette.AppRouter(
    controller: controller
    appRoutes:
        '': 'showIndex'
        'post/:basename': 'showPost'
        'projects': 'showProjects'
)

app.on 'all', (e) ->
    $('html,body').animate scrollTop:0, 200  if 0 is e.indexOf('show:')
        
app.on 'show:post', controller.showPost, controller
app.on 'show:index', controller.showIndex, controller
app.on 'show:projects', controller.showProjects, controller

app.on 'start', ->
    Backbone.history.start()
    app.layout.getRegion('header').show new HeaderView
    
app.start();

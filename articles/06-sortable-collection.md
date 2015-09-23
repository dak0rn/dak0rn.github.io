In a [recent post](#post/parseQuery) I described how complex search queries can be parsed
to create the base for a cascading search function. The idea was that a search string like
this

	genre:jazz artist:"Horace Silver" the "jazz messengers"
	
is converted into an array of strings an objects like this one:

```javascript
[ {genre: 'jazz'}, {artist: 'Horace Silver'}, 'the', 'jazz messengers' ]
```

Given such an array with criteria, it is quite easy to write a search algorithm that filters
a collection of models using two rules:

- If you have a criteria that is an object filter for the given model attributes only
- If you have a string criteria filter all model attributes for it

## What's bad about Backbone's Collection

One might think *Hey, that looks like we can use `_.where` in Backbone.Collection*.
While `Backbone.Collect.where()`, the built-in filter function from underscore (or $alternative),
allows you to filter the stored models it has a major downside when it comes to views: the filter
functions return an array.

Thus, you often find code like this:

```javascript
var models = collection.find( generateFilterFunction(criteria) );

// Updates the view
viewCollection.reset();
viewCollection.set(models);
```

What happens here is that two collections are used; one stores all models
while the other stores only models filtered from the original collection.

But that is not what I want. I don't want to have two collections that have to be synced
manually all the time.

Thus, I have written this handy Backbone.Collection that keeps a copy of itself internally.
Even though it does not overwrite any built-in filter method it is not meant to be used with them.

## What you need

As with the linked example above you have to include/export/... Backbone and underscore or lodash.
If you use userscore keep in mind that the query parsing function needs `_.trim()`. Thus, you have to
implement that manually.

```javascript
Backbone.Collection.extend({
	
	// Internal collection
	_raw: new (Backbone.Collection.extend({model:Model}))(),
	// Search term
	_term: null,
	
	
	initialize: function() {
		// Listen to events that change the collection
		this.listenTo(this, 'sync', this._synced, this );
		this.listenTo(this, 'add', this._added, this );
		this.listenTo(this, 'remove', this._removed, this );
	},
	
	
	_synced: function(stuff, data) {
		if( data ) {
			this._raw.reset();
			this._raw.add(data);
			
			if( this._term )
				this.filterCollection( this._term );
		}		
	},
	
	
	_added: function(model) {
		if( model ) {
			this._raw.add(model);
			
			if( this._term )
				this.filterCollection( this._term );
		}
	},
	
	
	_removed: function(model) {
		if( model ) {
			this._raw.remove(model);
			
			if( this._term )
				this.filterCollection( this._term );
		}
	},
	
	
	_filterArray: function(models, crit) {
		if( 0 === models.length )
			return models;
			
		var t = [];
		
		// Loop variables
		var i;
		var len;
		var prop;
		var val;
		var mval;
		var attrs = {};			// Object with criterias
		var keys = [];			// Keys to compare. Stored for performance.
		
		// If we got an object we compare all the keys
		// contained in the object with the models
		if( _.isObject(crit) ) {
			attrs = crit;
			keys = _.keys(attrs);
		}
		// If we get something else we compare all attributes
		// with whatever we got
		else {
			keys = _.keys( models[0].attributes );
			_.each(keys, function(k) { attrs[k] = crit; }); 
		}
		
		// all models ...
		_.each(models, function(target) {
			
			// and all attributes
			for( i = 0, len = keys.length; i < len; i++ ) {
				prop = keys[i];
				val  = attrs[prop];
				mval = target.get(prop);
				
				if( _.isUndefined(mval) || _.isNull(val)  )
					continue;
				
				// We only compare strings!
				val  = (""+val ).toLocaleLowerCase();
				mval = (""+mval).toLocaleLowerCase();
				
				// Contained or equal?
				if( val === mval || -1 < mval.indexOf(val) ) {
					t.push(target);
					break;
				}
			}
		}, this);
		return t;
	},
	
	resetFilter: function() {
		this._term = null;
		this.filterCollection();
	},
	
	_parseQuery = function(what){
	    var terms = [];
	    
	    // Split at spaces but keep quoted words together 
	    var parts = what.match(/(?:[^\s'"]+|['"][^'"]*['"])+/g);
		
		// Process each part
	    _.each(parts, function(e){
	
			// Remove leading and trailing quotes 
	        e = _.trim(e,'"\'');
	
			// Skip if invalid
	        if( _.isEmpty(e) )
	            return;
	    
			// Find the position of the first colon
	        var colon = e.indexOf(':');
	        
			// If there is no colon just add the single string
	        if( -1 === colon ) {
	            terms.push(e);
	            return;
	        }
	        
			// Get the part before the colon
	        var key = e.substr(0, colon);
	        
			// Criteria object
	        var obj = {};
			
	                   // Remove quotes from the part after
					   // the colon
	        obj[key] = _.trim(e.substr(colon+1), '\'"');
	      
		  	// Add the criteria
	        terms.push(obj);
	      
	    });
	    
	    return terms;
	},
	
	filterCollection: function(what) {
		
		var filtered = this._raw.slice();
		
		if( arguments.length ) {
			
			// Parse search term if it's a string
			if( _.isString(what) )
				what = this._parseQuery(what);
			// Not pretty but faster
			else if( ! _.isArray(what) )
				return;
				
			// Cache
			this._term = what;
			
			_.each( what, function(criteria){
				filtered = this._filterArray(filtered, criteria);
			}, this );
			
		}
		
		/*
		 * The collection changes only if
		 * - there is a different number of models now or
		 * - if there are new models that matched the criteria
		 */
		if( filtered.length !== this.models.length ||
		     _.some(this.models, function(e) { return ! _.contains(filtered,e); } ) ) {
			
			this.reset(undefined,{silent:true});
			this.add(filtered, {silent:true});
			this.trigger('change');					// Render again
		}
		
	}
	
});
```

The two important functions here are `filterCollection()` and `resetFilter()`. The latter resets
the collection by adding all originally contained models again.

The former function is responsible of filtering the collection. It stores all models in a Backbone.Collection
internally. `filterCollection()` accepts both strings and array. Strings are converted to an array of search
criteria automatically using the `_parseQuery()` function described in the referenced article.

The collection filters its models if you add or remove on. Thus, an added model may disappear automatically.
This is very useful if the user searches for something while the collection is being modified.

The collection updates itself only if the result set changes. If filter a filtered collection again (e.g. because
the user changed the search term) and the models stay the same you will not receive any change event.

## Natives

As written [in the documentation](http://backbonejs.org/#Collection-Underscore-Methods) Backbone.Collection
supports underscore/lodash functions to retrieve a (sub-) set of models. If you do not overwrite them these
functions will only operate on the filtered collection.

## require.js

Since I use require.js for a lot of my front-end applications this code is taken right out of one.
So, you can paste it into a require.js block to use it. Keep in mind to include the model.

```javascript
define([
	 'backbone',
	 'lodash',
	 '../model/Album',
 ], function(Backbone, _, Model) {
	 
	 return Backbone.Collection.extend({ ... });
 });
```
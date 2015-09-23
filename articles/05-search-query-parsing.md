A powerful search is often a key factor to success for front-end
applications. Think about a music management: you have an albums
page listing all albums you have where you want to search for
a specific one. Either using the album title or any other attribute
assigned to an album.
In addition, you have a genre overview page and if you click on a
genre you want to list all albums relating to that genre.

It is a good and common pattern to combine these two use cases by re-using
the already implemented search.

![](img/search.png)

This article will show you an important part of that search implementation: 
the parsing of the search query.

## Cascading search

What we want is a cascading search that allows to filter for specific
attributes or a value in general.
Sounds a bit complication, but it is quite easy though.

Given the following search term

```
genre:"jazz" artist:"thad jones" messengers
```

We have to do the following steps:

- Search for `jazz` in the attribute `genre`
- Search for `thad jones` in the attribute `artist`
- Search for `messengers` in all attributes

The search is supposed to be **cascading**. Means: we search
for `jazz` first. Then, we search for `thad jones` in the produced
result set and all objects that passed that test will the be filtered
for `messengers`. It would also have been possible to merge two search
results.

## What you need
I suppose you have *lodash* available in whatever environment you are developing
for. I use lodash because I like lodash and because it provides a very
handy `_.trim()` function. If you need to use underscore take a look
at [underscore.string](https://epeli.github.io/underscore.string/) or if you
not want to use any third party library at all implement the functions
`_.isEmpty()`, `_.each()` and `_.trim()`.

## How it works

The implementation is quite easy and short. We have a search term like this:

```
genre:"jazz" artist:"thad jones" messengers
```

So, what we do is the following:

- Split the string but keep quoted sections
- If we have an attribute search create an object with that attribute and value. Add it to the array.
- If we have a general search add the string to the array

The array with the parsed search criteria is returned. 

## Implementation

The function has to perform the following steps:

- Split the string but keep quoted sections
- Remove quotes
- Ignore invalid patterns
- Split at a colon if contained
- Create an object with the parsed values
- Add the object or the string to the array of criteria

This is the code that does all the magic:

```javascript
parseQuery = function(what){
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
};
```

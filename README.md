Backbone Data
=============

[![Build Status](https://travis-ci.org/skaterdav85/backbone-data.svg)](https://travis-ci.org/skaterdav85/backbone-data)

A simple data store for backbone models and collections inspired by Ember Data and angular-data.

## Key Features

* Automatic Caching and Identity Mapping - If a model had already been loaded, asking for it a second time will always return the same object instance. This minimizes the number of round-trips to the server.
* Provides a single point of entry for data access through the global variable _DS_
* Works with existing Backbone models and collections.
* Manages singletons for models and each collection type. 
	* Many times you'll need the same collection instance in multiple views. Just ask for a collection type from the store (`DS.getAll('person')`, `DS.findAll('person')`) and it will return or resolve with the same collection instance each time.
	* Maybe you have a single model instance in your application, like a `UserProfile` model. The data store can also manage it as a singleton so that you get the same `UserProfile` instance every time.
* Load models into the store specified as incomplete (lacking details). Extra details about the model can be fetched and cached on subsequent requests. Particularly useful if your models have a lot of data that might not be needed.
* Easily create new filtered collections
* AMD compatible
* 933 bytes gzipped and minified

[API Documentation and Examples](apidocs.md)

## Install

Grab the minified or unminified file from the _dist_ directory and include it on your page.

```html
<script src="dist/backbone-ds.min.js"></script>
```

Or install through Bower

```
bower install backbone-data
```

Or install through NPM

```
npm install backbone-data
```

This library exposes a global variable called _DS_ (Data Store) and it is also registers itself for AMD (Require.js).

## API Overview

### Collection Resources

#### Synchronous Methods

* DS.defineResource(resourceDefinition) - Create a new resource for the store to manage
* DS.inject(resourceName, model(s)) - Put models into the store
* DS.get(resourceName, id) - Return a single model from the store, or null otherwise
* DS.getAll(resourceName) - Return a collection of models from the store
* DS.where(resourceName, attributes) - Similar to Backbone.Collection's where method but returns a new collection instance of the collection type specified for resourceName
* DS.filter(resourceName, predicate) - Proxies to collection.filter() but returns a new collection instance of the collection type specified for resourceName
* DS.createInstance(resourceName) - Create a new Backbone model instance
* DS.ejectAll(resourceName) - Remove all models from the store for a resource

#### Asynchronous Methods

These methods return a promise

* DS.find(resourceName, id [, options]) - Resolves with the model retrieved and injected into the store
* DS.findAll(resourceName [, options]) - Resolves with the collection instance managed by the store for _resourceName_
* DS.create(resourceName, model) - Resolves with the newly created and injected model
* DS.destroy(resourceName, id) - Destroy a model in the store
* DS.update(resourceName, id, properties) - Update a model in the store and resolves with model

### Model Resources

This is useful if you want to manage a single model in your application, like a user profile that is tied to the user's session.

#### Synchronous Methods

* DS.defineResource(resourceDefinition)
* DS.inject(resourceName, model)
* DS.get(resourceName)

#### Asynchronous Methods

* DS.find(resourceName) - Makes a request for a model only once and resolves with the model

## Tests

Tests are using Mocha, Chai, and Sinon. Run tests with karma.

```js
bower install
npm install
karma start
```

## Build

This will create the distribution files in the _dist_ folder

```
gulp
```

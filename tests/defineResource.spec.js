describe('defineResource()', function() {
	var Person;

	beforeEach(function() {
		Person = Backbone.Model.extend({
			url: function() {
				return '/people/' + this.get('id')
			}
		});
	});

	afterEach(function() {
		DS.ejectAll('person');
		DS.reset();
	});

	it('should use the model associated with the collection if a collection resource', function() {
		var Person = Backbone.Model.extend();
		var People = Backbone.Collection.extend({
			model: Person
		});

		DS.defineResource({
			name: 'person',
			idAttribute: 'id',
			collection: People
		});

		var david = DS.createInstance('person');
		expect(david).to.be.an.instanceof(Person);
	});

	it('should use Backbone.Collection if no collection is specified and idAttribute is present', function() {
		DS.defineResource({
			name: 'employee',
			idAttribute: 'id'
		});

		expect(DS.getAll('employee')).to.be.an.instanceof(Backbone.Collection);
	});

	it('should use Backbone.Model for model resources if none is specified', function() {
		expect(function() {
			DS.defineResource({
				name: 'user'
			});
		}).not.to.throw(Error);
	});

	it('should throw an error if name is not provided', function() {
		expect(function() {
			DS.defineResource({
				idAttribute: 'id',
				collection: Backbone.Collection,
				model: Backbone.Model
			});
		}).to.throw(Error);
	});

	it('should throw an error if idAttribute is not provided', function() {
		expect(function() {
			DS.defineResource({
				name: 'person',
				collection: Backbone.Collection,
				model: Backbone.Model
			});
		}).to.throw(Error);
	});

	it('should throw an error if name is empty', function() {
		expect(function() {
			DS.defineResource({
				idAttribute: 'id',
				name: '',
				collection: Backbone.Collection,
				model: Backbone.Model
			});
		}).to.throw(Error);
	});

	it('should throw an error if a resource is already defined for a given name', function() {
		expect(function() {
			DS.defineResource({
				idAttribute: 'id',
				name: 'student',
				collection: Backbone.Collection,
				model: Backbone.Model
			});

			DS.defineResource({
				idAttribute: 'id',
				name: 'student',
				collection: Backbone.Collection,
				model: Backbone.Model
			});
		}).to.throw(Error);
	});
});
describe('find()', function() {
	afterEach(function() {
		DS.ejectAll('person');
		DS.reset();
	});

	describe('collection resources', function() {
		var people;
		var Person;
		var PersonCollection;

		beforeEach(function() {
			Person = Backbone.Model.extend({
				url: function() {
					return '/people/' + this.get('id')
				}
			});

			PersonCollection = Backbone.Collection.extend({
				model: Person
			});

			DS.defineResource({
				name: 'person',
				idAttribute: 'id',
				model: Person,
				collection: PersonCollection
			});

			people = [
				{ id: 1, name: 'John', age: 54 },
				{ id: 2, name: 'Jane', age: 24 },
				{ id: 3, name: 'Matt', age: 34 }
			];
		});

		it('should not make a request for the model if it is already in the store', function() {
			DS.inject('person', people);
			var stub = sinon.stub(Backbone.Model.prototype, 'fetch');
			DS.find('person', 2).then(function(model) {
				expect(model.toJSON()).to.eql({ id: 2, name: 'Jane', age: 24 });
			});

			expect(stub.callCount).to.equal(0);
			Backbone.Model.prototype.fetch.restore();
		});

		it('should store a model in the store when it has fetched it successfully', function(done) {
			var server = sinon.fakeServer.create();
			server.respondWith("GET", "/people/12345",
		        [200, { "Content-Type": "application/json" },
		         '{ "id": 12345, "name": "Gwen" }']);

			DS.find('person', 12345).done(function() {
				expect(DS.get('person', 12345).toJSON()).to.eql({ "id": 12345, "name": "Gwen" });
				done();
			});

			server.respond();
			server.restore();
		});

		it('should resolve with the parsed json error', function(done) {
			var server = sinon.fakeServer.create();
			server.respondWith("GET", "/people/12345",
		        [400, { "Content-Type": "application/json" },
		         '{ "error": "some error" }']);

			DS.find('person', 12345).then(function() {}, function(response) {
				expect(response).to.eql({ error: 'some error' });
				done();
			});

			server.respond();
			server.restore();
		});

		it('should allow an array of models to be specified as incomplete when injected', function(done) {
			DS.inject('person', people, { incomplete: true });

			var server = sinon.fakeServer.create();
			server.respondWith("GET", "/people/3",
		        [200, { "Content-Type": "application/json" },
		         '{ "id": 3, "name": "Matt", "age": 34, "middle": "Ryu" }']);

			DS.find('person', 3).done(function(person3) {
				expect(DS.get('person', 3).toJSON()).to.eql({ id: 3, name: "Matt", age: 34, middle: "Ryu" });
				expect(DS.get('person', 3)).to.equal(person3);
				done();
			});

			server.respond();
			server.restore();
		});

		it('should allow a single model to be specified as incomplete when injected', function(done) {
			DS.inject('person', people[2], { incomplete: true });

			var server = sinon.fakeServer.create();
			server.respondWith("GET", "/people/3",
		        [200, { "Content-Type": "application/json" },
		         '{ "id": 3, "name": "Matt", "age": 34, "middle": "Ryu" }']);

			DS.find('person', 3).done(function(person3) {
				expect(DS.get('person', 3).toJSON()).to.eql({ id: 3, name: "Matt", age: 34, middle: "Ryu" });
				expect(DS.get('person', 3)).to.equal(person3);
				done();
			});

			server.respond();
			server.restore();
		});

		it('should not make subsequent http requests if an incomplete model turns complete', function() {
			var spy = sinon.spy(Backbone.Model.prototype, 'fetch');
			var server = sinon.fakeServer.create();
			server.respondWith("GET", "/people/3",
		        [200, { "Content-Type": "application/json" },
		         '{ "id": 3, "name": "Matt", "age": 34, "middle": "Ryu" }']);

			DS.inject('person', people[2], { incomplete: true });
			DS.find('person', 3).then(function() {
				DS.find('person', 3).then(function() {
					expect(spy.callCount).to.equal(1);
				});
			});

			server.respond();
			server.respond();
			server.restore();
			Backbone.Model.prototype.fetch.restore();
		});
	});

	describe('model resource', function() {
		it('should make a request for a model if it has not been fetched', function(done) {
			var server = sinon.fakeServer.create();
			server.respondWith("GET", "/profile",
		        [200, { "Content-Type": "application/json" },
		         '{ "name": "Sean", "age": 34 }']);

			var UserProfile = Backbone.Model.extend({
				url: '/profile'
			});

			DS.defineResource({
				name: 'profile',
				model: UserProfile
			});

			DS.find('profile').then(function() {
				expect(DS.get('profile').toJSON()).to.eql({ name: 'Sean', age: 34 });
				done();
			});

			server.respond();
			server.restore();
		});

		it('should not make a request for a model if it has been fetched', function(done) {
			var spy = sinon.spy(Backbone.Model.prototype, 'fetch');
			var server = sinon.fakeServer.create();
			server.respondWith("GET", "/profile",
		        [200, { "Content-Type": "application/json" },
		         '{ "name": "Sean", "age": 34 }']);

			var UserProfile = Backbone.Model.extend({
				url: '/profile'
			});

			DS.defineResource({
				name: 'profile',
				model: UserProfile
			});

			DS.find('profile').then(function() {
				DS.find('profile').then(function() {
					expect(spy.callCount).to.equal(1);
					done();
				});
			});

			server.respond();
			server.restore();
			Backbone.Model.prototype.fetch.restore();
		});

		it('should resolve with the model', function(done) {
			var server = sinon.fakeServer.create();
			server.respondWith("GET", "/profile",
		        [200, { "Content-Type": "application/json" },
		         '{ "name": "Sean", "age": 34 }']);

			var UserProfile = Backbone.Model.extend({
				url: '/profile'
			});

			DS.defineResource({
				name: 'profile',
				model: UserProfile
			});

			DS.find('profile').then(function(model) {
				expect(DS.get('profile')).to.equal(model);
				done();
			});

			server.respond();
			server.restore();
		});

		it('should reject with the parsed error', function(done) {
			var server = sinon.fakeServer.create();
			server.respondWith("GET", "/profile",
		        [400, { "Content-Type": "application/json" },
		         '{ "error": "oh no!" }']);

			var UserProfile = Backbone.Model.extend({
				url: '/profile'
			});

			DS.defineResource({
				name: 'profile',
				model: UserProfile
			});

			DS.find('profile').then(function() {}, function(err) {
				expect(err).to.eql({ error: 'oh no!' });
				done();
			});

			server.respond();
			server.restore();
		});
	});
});

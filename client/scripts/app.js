var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    like: this.set('like', !this.get('like'));
    console.log('this.collection:', this.collection);
    this.collection.sort();
    
    // Movies.sortByField(to);
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    // your code here
  },

  comparator: 'title',

  sortByField: function(field) {
    // your code here 
    // console.log(this);
    // console.log('field ', field);
    this.comparator = field; 
    // console.log('comparator', this.get('comparator'));
    this.sort();
    
  }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    this.model.on('change:like', function() {
    /* Let's break down the line above:
     * - `this`           => the CommentView instance
     * - `this.model`     => the model associated with this view instance
     *   - This has not been set yet - it will be set later to a Comment model.
     * - `this.model.on`  => register an event listener to the model
     * - `'change:votes'` => this first argument defines what to listen for
     *   - We can listen for a change on a specific attribute using a colon.
     * - `function`       => this is the callback for this event listener */
      this.render();
    /*   - Usually, we can't rely on `this` being what we think it is in
     *      an event listener. However, Backbone allows us to specify what
     *      `this` will be in the third argument of `model.on`,
     *      as we will do in the next line: */
    }, this);
    /* We've passed in `this` from the the outer scope into the event listener,
     * making it so that `this` is bound to the individual comment's view,
     * and not some random thing.
     *
     * If this is confusing, ask your peers and halp desk
     * until you have a good grasp of the concept.
     */
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    this.model.toggleLike();

  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() { // this is called every time we want a new view of movies
    console.log('thisssss', this);
    this.collection.on('sort', function() {
      //this.collectionView.sort();
      this.render();
    }, this);
    
  },
  
  // events: {
  //   'click button'
  // }

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});

var Node = require('./node.js');
/*var MapView = Backbone.View.extend({
    tagName : 'div',
    className : 'map',
    collection : null,

    initialize : function (options) {
        this.nodes = options.nodesArray;

        this.collection = new NodesList(this.nodes);
        this.render();

    },
    render : function () {
    	var that = this;
        _.each(this.collection.models, function (node) {
            var nodeView = new NodeView({ model : food });
            that.$el.append(foodView.el);
        });
    }
});*/

/** @arg : foodList - array of food objects
 ** @return : ordered foodList based on food's priority
 **/
/*var sortFoodArray = function sortFoodArray (foodArray, cb) {
    var sortedFoodArray = _.sortBy(foodArray, function (food) {
    	// sort from LARGEST to smallest
        return ( -1 * food['priority'] );
    });

    return cb(sortedFoodArray);
};

//Populate the feed
var feedView;
var thefood = new FoodList();
thefood.fetch({
    success : function (f) {
        sortFoodArray(f.toJSON(), function (sortedFoodArray) {
	        feedView = new FeedView({ foodArray : sortedFoodArray });
	        $('#feed-container').html(feedView.el);
	    });
    }
});
*/


$(document).ready(function() {
// add nodesList from the db

    // enable form submit button so new nodes can be added
    $('.submit').click(function (e) {
        e.preventDefault();

         title  = $('.title').val();

         var newNode = new Node.Node(title);
    });
});

var NodeModel = Backbone.Model.extend({
    defaults : {
        id : null,
        title : "",
        x : 0,
        y : 0
    }
});
var NodeList = Backbone.Collection.extend({
    model : NodeModel,
    url : 'http://localhost:8081/nodes'
});

var NodeView = Backbone.View.extend({
    model : NodeModel,

    initialize : function (options) {
        this.title = options.title;
        this.render();
    },

    render : function () {
        var view = this.template({ title : this.title });
        this.$el.html(view);
    },

    template : function (data) {
        var src = $('#node-tpl').html(),
        tpl = Handlebars.compile(src);

        return tpl(data);
    },
});


var Node = function Node (title) {
    var x,
        y;

    var nodeModel = new NodeModel({
        //id : Date.now(),
        title : title,
        x : 0,
        y : 0
    });

    //// since I am setting the id above, this is probably causing
    //// an update to trigger rather than a put.

    // save model
    nodeModel.save({}, {
        success : function(model, response) {
            console.log('Successfully saved!');
        },
        error : function(model, error) {
            console.log(model.toJSON());
            console.log(error.responseText);
        }
    });


    var nodeView = new NodeView({ title : title });

    // append to map
    $('.map').append(nodeView.el);

    $(nodeView.el).draggable({
        stop : function() {
            var offset = $(this).offset();
            var xPos = offset.left;
            var yPos = offset.top;
            console.log("save to server : ", xPos, yPos);

            // is this right? Do I need this?
            nodeModel.x = xPos;
            nodeModel.y = yPos;

            // trigger change event
        }
    });

    // mk nodeModel public
    this.model = nodeModel;
};

module.exports.Node = Node;

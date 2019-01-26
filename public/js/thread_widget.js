var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

{/*const threads = [
   {
     title: "The Fox and the Hound",
     entryCount: 23,
     id: 1
   },
   {
     title: "I wonder if this will fit in the box",
     entryCount: 65,
     id: 2
   },
   {
     title: "Another Story About Dragons",
     entryCount: 32,
     id: 3
   },
   {
     title: "Thomas the Tank",
     entryCount: 6,
     id: 4
   },
   {
     title: "Lilo And Stitches",
     entryCount: 23,
     id: 5
   },
   {
     title: "What is your favorite flavor of mouse?",
     entryCount: 8,
     id: 6
   },
   {
     title: "The Fox and the Hound",
     entryCount: 23,
     id: 7
   },
   {
     title: "The Fox and the Hound",
     entryCount: 23,
     id: 8
   },
   {
     title: "The Fox and the Hound",
     entryCount: 23,
     id: 9
   },
   {
     title: "The Fox and the Hound",
     entryCount: 23,
     id: 10
   }
  ] */}

var ThreadListing = function (_React$Component) {
  _inherits(ThreadListing, _React$Component);

  function ThreadListing() {
    _classCallCheck(this, ThreadListing);

    var _this = _possibleConstructorReturn(this, (ThreadListing.__proto__ || Object.getPrototypeOf(ThreadListing)).call(this));

    _this.state = {
      entryCount: 0
    };
    return _this;
  }

  _createClass(ThreadListing, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "button",
        { className: "btn btn-light thread m-1 p-2", onClick: this.routeChange },
        React.createElement(
          "span",
          { className: "p font-weight-light" },
          this.props.firstEntry
        ),
        React.createElement(
          "span",
          { className: "entriesCount float-right" },
          this.props.entryCount + "/10"
        )
      );
    }
  }]);

  return ThreadListing;
}(React.Component);

{/*Stateless*/}
var ListHeading = function ListHeading() {
  return React.createElement(
    "div",
    { className: "m-1" },
    React.createElement(
      "span",
      { className: "h5 font-weight-light" },
      "Last Contribution"
    ),
    React.createElement(
      "span",
      { className: "h5 float-right font-weight-light" },
      "Entry Count"
    )
  );
};

{/*Stateless*/}
var PageHeading = function PageHeading(props) {
  return React.createElement(
    "div",
    { className: "font-weight-bold thread-title" },
    props.heading
  );
};

var ThreadsList = function (_React$Component2) {
  _inherits(ThreadsList, _React$Component2);

  function ThreadsList() {
    _classCallCheck(this, ThreadsList);

    var _this2 = _possibleConstructorReturn(this, (ThreadsList.__proto__ || Object.getPrototypeOf(ThreadsList)).call(this));
    // Remember, calling super allows this "dot" notation.


    _this2.state = {
      threads: []
    };
    return _this2;
  }

  // For rendering list of incomplete threads.
  // Check threads.js for get method of /threads/closed.json


  _createClass(ThreadsList, [{
    key: "generateCompletedThreads",
    value: function generateCompletedThreads() {
      var _this3 = this;

      axios.get('http://localhost:3000/threads/closed.json').then(function (response) {
        _this3.setState({
          threads: response.data
        });
      }).catch(function (error) {
        console.log("error fetching completed threads", error);
      });
    }

    // For rendering list of closed (completed) threads
    // Check threads.js for get method of /threads/open.json

  }, {
    key: "generateOpenThreads",
    value: function generateOpenThreads() {
      var _this4 = this;

      axios.get('http://localhost:3000/threads/open.json').then(function (response) {
        _this4.setState({
          threads: response.data
        });
      }).catch(function (error) {
        console.log("error fetching completed threads", error);
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.generateOpenThreads();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "container" },
        React.createElement(PageHeading, { heading: "All Threads" }),
        React.createElement(
          "div",
          { className: "threadsList" },
          React.createElement(ListHeading, null),
          this.state.threads.map(function (thread) {
            return React.createElement(ThreadListing, {
              key: thread._id.toString(),
              firstEntry: thread.entries[0].entry,
              entryCount: thread.entryCount
            });
          })
        )
      );
    }
  }]);

  return ThreadsList;
}(React.Component);

ReactDOM.render(React.createElement(ThreadsList, null), document.getElementById('reactEle'));
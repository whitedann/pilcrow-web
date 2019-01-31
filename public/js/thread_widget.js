var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = React.Component;

var ThreadsWidget = function (_Component) {
  _inherits(ThreadsWidget, _Component);

  function ThreadsWidget() {
    _classCallCheck(this, ThreadsWidget);

    var _this = _possibleConstructorReturn(this, (ThreadsWidget.__proto__ || Object.getPrototypeOf(ThreadsWidget)).call(this));

    _this.state = {
      threads: [],
      title: "Loading...",
      user: "Waiting...",
      submissions: [],
      leftColTitle: "",
      rightColTitle: "",
      createPostClick: false
      //Bind the functions to the instance of this component.
    };_this.generateClosedThreads = _this.generateClosedThreads.bind(_this);
    _this.generateOpenThreads = _this.generateOpenThreads.bind(_this);
    _this.generateYourPastThreads = _this.generateYourPastThreads.bind(_this);
    _this.getCurrentUserInfo = _this.getCurrentUserInfo.bind(_this);
    _this.createNewThreadForm = _this.createNewThreadForm.bind(_this);
    return _this;
  }

  _createClass(ThreadsWidget, [{
    key: "getCurrentUserInfo",
    value: function getCurrentUserInfo() {
      var _this2 = this;

      axios.get('http://localhost:3000/profile.json').then(function (response) {
        _this2.setState({
          user: response.data.username
        });
      }).catch(function (error) {
        console.log("error finding current user", error);
      });
    }
  }, {
    key: "generateYourPastThreads",
    value: function generateYourPastThreads() {
      var _this3 = this;

      axios.get('http://localhost:3000/profile.json').then(function (response) {
        _this3.setState({
          submissions: response.data.contributions,
          threads: [],
          title: "Your Threads",
          leftColTitle: "Entry",
          rightColTitle: "",
          createPostClicked: false
        });
      }).catch(function (error) {
        console.log("error fetching user submissions");
      });
    }

    // For rendering list of incomplete threads.
    // Check threads.js for get method of /threads/closed.json

  }, {
    key: "generateClosedThreads",
    value: function generateClosedThreads() {
      var _this4 = this;

      axios.get('http://localhost:3000/threads/closed.json').then(function (response) {
        _this4.setState({
          threads: response.data,
          submissions: [],
          title: "Closed Threads",
          leftColTitle: "Title",
          rightColTitle: "Total Contributions",
          createPostClick: false
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
      var _this5 = this;

      axios.get('http://localhost:3000/threads/open.json').then(function (response) {
        _this5.setState({
          threads: response.data,
          submissions: [],
          title: "Open Threads",
          leftColTitle: "Most Recent Entry",
          rightColTitle: "Entry Count",
          createPostClicked: false
        });
      }).catch(function (error) {
        console.log("error fetching completed threads", error);
      });
    }
  }, {
    key: "createNewThreadForm",
    value: function createNewThreadForm() {
      this.setState({
        createPostClicked: true,
        title: "Start a New Thread"
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getCurrentUserInfo();
      this.generateOpenThreads();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "row my-5" },
        React.createElement(SideBar, {
          generateOpenThreads: this.generateOpenThreads,
          generateClosedThreads: this.generateClosedThreads,
          generateYourPastThreads: this.generateYourPastThreads,
          createNewThreadForm: this.createNewThreadForm,
          user: this.state.user
        }),
        this.state.createPostClicked ? React.createElement(NewPostForm, {
          title: this.state.title
        }) : React.createElement(ThreadsList, {
          threads: this.state.threads,
          submissions: this.state.submissions,
          title: this.state.title,
          leftColTitle: this.state.leftColTitle,
          rightColTitle: this.state.rightColTitle
        })
      );
    }
  }]);

  return ThreadsWidget;
}(Component);

var NewPostForm = function (_Component2) {
  _inherits(NewPostForm, _Component2);

  function NewPostForm() {
    _classCallCheck(this, NewPostForm);

    var _this6 = _possibleConstructorReturn(this, (NewPostForm.__proto__ || Object.getPrototypeOf(NewPostForm)).call(this));

    _this6.state = {
      maxChars: 10,
      maxEntries: 10,
      currentChars: 0,
      currentString: "",
      title: ""
    };
    _this6.makeAndRouteToNewThread = _this6.makeAndRouteToNewThread.bind(_this6);
    _this6.handleChange = _this6.handleChange.bind(_this6);
    _this6.handleTextAreaChange = _this6.handleTextAreaChange.bind(_this6);
    return _this6;
  }

  _createClass(NewPostForm, [{
    key: "makeAndRouteToNewThread",
    value: function makeAndRouteToNewThread() {
      var my = this;
      axios.post('http://localhost:3000/threads/', {
        content: my.state.currentString,
        maxEntries: my.state.maxEntries,
        title: my.state.title
      }).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: "handleChange",
    value: function handleChange(event) {
      this.setState({ maxChars: event.target.value });
    }
  }, {
    key: "handleTextAreaChange",
    value: function handleTextAreaChange(event) {
      this.setState({
        currentChars: event.target.value.length,
        currentString: event.target.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "container col-md-9" },
        React.createElement(PageHeading, { heading: this.props.title }),
        React.createElement(
          "div",
          { className: "bg-light-purp p-3" },
          React.createElement(
            "form",
            null,
            React.createElement(
              "div",
              { className: "form-row" },
              React.createElement(
                "div",
                { className: "form-group col-md-3" },
                React.createElement(
                  "label",
                  null,
                  "Max characters per entry"
                ),
                React.createElement(
                  "select",
                  { value: this.state.maxChars, onChange: this.handleChange, className: "form-control" },
                  React.createElement(
                    "option",
                    { value: "10" },
                    "10"
                  ),
                  React.createElement(
                    "option",
                    { value: "20" },
                    "20"
                  )
                )
              ),
              React.createElement(
                "div",
                { className: "form-group col-md-3" },
                React.createElement(
                  "label",
                  null,
                  "Entry Limit"
                ),
                React.createElement(
                  "select",
                  { className: "form-control" },
                  React.createElement(
                    "option",
                    null,
                    "10"
                  ),
                  React.createElement(
                    "option",
                    null,
                    "100"
                  )
                )
              ),
              React.createElement("div", { className: "col-md-6" })
            ),
            React.createElement(
              "div",
              { className: "form-group" },
              React.createElement(
                "label",
                { className: "aventir" },
                "Give the thread a title:"
              ),
              React.createElement("input", { className: "form-control newThreadInput" })
            ),
            React.createElement(
              "div",
              { className: "form-group" },
              React.createElement(
                "label",
                { className: "mt-4" },
                "Write the first entry:"
              ),
              React.createElement("textarea", { className: "form-control", rows: "6", maxLength: this.state.maxChars, onChange: this.handleTextAreaChange })
            ),
            React.createElement(
              "p",
              null,
              this.state.currentChars,
              "/",
              this.state.maxChars
            ),
            React.createElement(
              "button",
              { className: "btn btn-lg btn-dark text-center", onClick: this.makeAndRouteToNewThread },
              "Create"
            ),
            React.createElement(
              "p",
              { className: "mt-1 font-italic" },
              "Note: You can only create one thread per day "
            )
          )
        )
      );
    }
  }]);

  return NewPostForm;
}(Component);

var SideBar = function SideBar(props) {
  return React.createElement(
    "div",
    { className: "col-md-3 menu py-3 avenir" },
    React.createElement(
      "h3",
      null,
      props.user
    ),
    React.createElement(
      "p",
      null,
      "Score: 9"
    ),
    React.createElement("hr", { className: "menu-divider mt-0" }),
    React.createElement(
      "button",
      { className: "btn btn-block btn-primary mt-3 py-2", onClick: props.generateClosedThreads },
      "Closed Threads"
    ),
    React.createElement(
      "button",
      { className: "btn btn-block btn-warning py-2", onClick: props.generateOpenThreads },
      "Open Threads"
    ),
    React.createElement(
      "button",
      { className: "btn btn-block btn-warning py-2", onClick: props.generateYourPastThreads },
      "Your Contributions"
    ),
    React.createElement(
      "button",
      { className: "btn btn-block btn-success py-3 mt-5", onClick: props.createNewThreadForm },
      "Start A New Thread"
    )
  );
};

var ThreadListing = function (_Component3) {
  _inherits(ThreadListing, _Component3);

  function ThreadListing() {
    _classCallCheck(this, ThreadListing);

    return _possibleConstructorReturn(this, (ThreadListing.__proto__ || Object.getPrototypeOf(ThreadListing)).call(this));
  }

  _createClass(ThreadListing, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "a",
        { href: '/threads/' + this.props.id },
        React.createElement(
          "button",
          { className: "btn btn-light thread m-1 p-2" },
          React.createElement(
            "span",
            { className: "p font-weight-light" },
            this.props.latestEntry
          ),
          React.createElement(
            "span",
            { className: "entriesCount float-right" },
            this.props.entryCount + "/10"
          )
        )
      );
    }
  }]);

  return ThreadListing;
}(Component);

var SubmissionListing = function SubmissionListing(props) {
  return React.createElement(
    "a",
    { href: '/threads/' + props.parentID },
    React.createElement(
      "button",
      { className: "btn btn-light thread m-1 p-2" },
      React.createElement(
        "span",
        { className: "p font-weight-light" },
        props.entry
      )
    )
  );
};

{/*Stateless*/}
var ListHeading = function ListHeading(props) {
  return React.createElement(
    "div",
    { className: "m-1" },
    React.createElement(
      "span",
      { className: "h5 font-weight-light" },
      props.leftColTitle
    ),
    React.createElement(
      "span",
      { className: "h5 float-right font-weight-light" },
      props.rightColTitle
    )
  );
};

{/*Stateless*/}
var PageHeading = function PageHeading(props) {
  return React.createElement(
    "div",
    { className: "font-weight-bold thread-title avenir" },
    props.heading
  );
};

var ThreadsList = function ThreadsList(props) {
  return React.createElement(
    "div",
    { className: "container col-md-9" },
    React.createElement(PageHeading, { heading: props.title }),
    React.createElement(
      "div",
      { className: "threadsList" },
      React.createElement(ListHeading, {
        leftColTitle: props.leftColTitle,
        rightColTitle: props.rightColTitle
      }),
      props.submissions.map(function (submission) {
        return React.createElement(SubmissionListing, {
          key: submission._id.toString(),
          entry: submission.entry,
          parentID: submission.parentID
        });
      }),
      props.threads.map(function (thread) {
        return React.createElement(ThreadListing, {
          key: thread._id.toString(),
          latestEntry: thread.entries[0].entry,
          entryCount: thread.entryCount,
          id: thread._id
        });
      })
    )
  );
};

ReactDOM.render(React.createElement(ThreadsWidget, null), document.getElementById('reactEle'));
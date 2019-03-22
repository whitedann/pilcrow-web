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
      userScore: 0,
      submissions: [],
      createPostClick: false,
      currentPageOpen: 0,
      currentPageClosed: 0,
      currentDisplay: "NONE"
      //Bind the functions to the instance of this component.
    };_this.generateClosedThreads = _this.generateClosedThreads.bind(_this);
    _this.generateOpenThreads = _this.generateOpenThreads.bind(_this);
    _this.generateYourPastThreads = _this.generateYourPastThreads.bind(_this);
    _this.getCurrentUserInfo = _this.getCurrentUserInfo.bind(_this);
    _this.createNewThreadForm = _this.createNewThreadForm.bind(_this);
    _this.pageForwardOpen = _this.pageForwardOpen.bind(_this);
    _this.pageBackwardOpen = _this.pageBackwardOpen.bind(_this);
    _this.pageForwardClosed = _this.pageForwardClosed.bind(_this);
    _this.pageBackwardClosed = _this.pageBackwardClosed.bind(_this);
    return _this;
  }

  _createClass(ThreadsWidget, [{
    key: "getCurrentUserInfo",
    value: function getCurrentUserInfo() {
      var _this2 = this;

      axios.get("http://" + window.location.hostname + ":3000/profile.json").then(function (response) {
        _this2.setState({
          user: response.data.username,
          userScore: response.data.contributionsCount
        });
      }).catch(function (error) {
        console.log("error finding current user", error);
      });
    }
  }, {
    key: "generateYourPastThreads",
    value: function generateYourPastThreads() {
      var _this3 = this;

      axios.get("http://" + window.location.hostname + ":3000/profile.json").then(function (response) {
        _this3.setState({
          submissions: response.data.contributions,
          threads: [],
          title: "Browse Your Contributions",
          createPostClicked: false
        });
      }).catch(function (error) {
        console.log("error fetching past threads");
      });
    }

    // For rendering list of incomplete threads.
    // Check threads.js for get method of /threads/closed.json

  }, {
    key: "generateClosedThreads",
    value: function generateClosedThreads() {
      var _this4 = this;

      axios.get("http://" + window.location.hostname + ":3000" + window.location.pathname + '/closed?page=' + this.state.currentPageClosed).then(function (response) {
        _this4.setState({
          threads: response.data,
          submissions: [],
          title: "Browse Closed Threads",
          createPostClick: false,
          currentDisplay: "CLOSED"
        });
      }).then(function () {
        if (_this4.state.threads.length == 0) {
          _this4.pageBackwardClosed();
        }
      }).catch(function (error) {
        console.log("error fetching completed threads", error);
      });
    }

    // For rendering list of open threads
    // Check threads.js for get method of /threads/open.json

  }, {
    key: "generateOpenThreads",
    value: function generateOpenThreads() {
      var _this5 = this;

      axios.get("http://" + window.location.hostname + ":3000" + window.location.pathname + '/open?page=' + this.state.currentPageOpen).then(function (response) {
        _this5.setState({
          threads: response.data,
          submissions: [],
          title: "Browse Open Threads",
          createPostClicked: false,
          currentDisplay: "OPEN"
        });
      }).then(function () {
        if (_this5.state.threads.length == 0) {
          _this5.pageBackwardOpen();
        }
      }).catch(function (error) {
        console.log("error fetching completed threads", error);
      });
    }
  }, {
    key: "pageForwardOpen",
    value: function pageForwardOpen() {
      var _this6 = this;

      this.setState({
        currentPageOpen: this.state.currentPageOpen + 1
      }, function () {
        _this6.generateOpenThreads();
      });
    }
  }, {
    key: "pageBackwardOpen",
    value: function pageBackwardOpen() {
      var _this7 = this;

      if (this.state.currentPageOpen > 0) {
        this.setState({
          currentPageOpen: this.state.currentPageOpen - 1
        }, function () {
          _this7.generateOpenThreads(function () {
            console.log(thisstate.currentDisplay);
          });
        });
      }
    }
  }, {
    key: "pageForwardClosed",
    value: function pageForwardClosed() {
      var _this8 = this;

      this.setState({
        currentPageClosed: this.state.currentPageClosed + 1
      }, function () {
        _this8.generateClosedThreads(function () {
          console.log(_this8.state.currentDisplay);
        });
      });
    }
  }, {
    key: "pageBackwardClosed",
    value: function pageBackwardClosed() {
      var _this9 = this;

      if (this.state.currentPageClosed > 0) {
        this.setState({
          currentPageClosed: this.state.currentPageClosed - 1
        }, function () {
          _this9.generateClosedThreads(function () {
            console.log(_this9.state.currentDisplay);
          });
        });
      }
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
        { className: "row my-5 x" },
        React.createElement(
          "div",
          { className: "col-md-3" },
          React.createElement(SideBar, {
            generateOpenThreads: this.generateOpenThreads,
            generateClosedThreads: this.generateClosedThreads,
            generateYourPastThreads: this.generateYourPastThreads,
            createNewThreadForm: this.createNewThreadForm,
            user: this.state.user,
            userScore: this.state.userScore
          })
        ),
        this.state.createPostClicked ? React.createElement(NewPostForm, {
          title: this.state.title
        }) : React.createElement(
          "div",
          { className: "col-md-9" },
          React.createElement(ThreadsList, {
            threads: this.state.threads,
            submissions: this.state.submissions,
            title: this.state.title,
            pageForwardOpen: this.pageForwardOpen,
            pageBackwardOpen: this.pageBackwardOpen,
            pageForwardClosed: this.pageForwardClosed,
            pageBackwardClosed: this.pageBackwardClosed,
            currentDisplay: this.state.currentDisplay
          }),
          React.createElement(PageButtons, {
            pageForwardOpen: this.pageForwardOpen,
            pageBackwardOpen: this.pageBackwardOpen,
            pageForwardClosed: this.pageForwardClosed,
            pageBackwardClosed: this.pageBackwardClosed,
            currentDisplay: this.state.currentDisplay
          })
        )
      );
    }
  }]);

  return ThreadsWidget;
}(Component);

var NewPostForm = function (_Component2) {
  _inherits(NewPostForm, _Component2);

  function NewPostForm() {
    _classCallCheck(this, NewPostForm);

    var _this10 = _possibleConstructorReturn(this, (NewPostForm.__proto__ || Object.getPrototypeOf(NewPostForm)).call(this));

    _this10.state = {
      maxChars: 1,
      maxEntries: 10,
      currentChars: 0,
      currentString: "",
      title: "(No Title)"
    };

    _this10.handleTitleChange = _this10.handleTitleChange.bind(_this10);
    _this10.makeAndRouteToNewThread = _this10.makeAndRouteToNewThread.bind(_this10);
    _this10.handleMaxCharChange = _this10.handleMaxCharChange.bind(_this10);
    _this10.handleTextAreaChange = _this10.handleTextAreaChange.bind(_this10);
    _this10.handleMaxEntriesChange = _this10.handleMaxEntriesChange.bind(_this10);
    return _this10;
  }

  _createClass(NewPostForm, [{
    key: "makeAndRouteToNewThread",
    value: function makeAndRouteToNewThread() {
      //declare instance of this component to get around scoping issues of "this"
      var my = this;
      axios.post("http://" + window.location.hostname + ":3000" + window.location.pathname, {
        content: my.state.currentString,
        maxEntries: my.state.maxEntries,
        title: my.state.title,
        maxChars: my.state.maxChars
      }).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: "handleTitleChange",
    value: function handleTitleChange(event) {
      this.setState({ title: event.target.value });
    }
  }, {
    key: "handleMaxCharChange",
    value: function handleMaxCharChange(event) {
      this.setState({ maxChars: event.target.value });
    }
  }, {
    key: "handleMaxEntriesChange",
    value: function handleMaxEntriesChange(event) {
      this.setState({ maxEntries: event.target.value });
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
                  { value: this.state.maxChars, onChange: this.handleMaxCharChange, className: "form-control" },
                  React.createElement(
                    "option",
                    { value: "1" },
                    "1"
                  ),
                  React.createElement(
                    "option",
                    { value: "10" },
                    "10"
                  ),
                  React.createElement(
                    "option",
                    { value: "50" },
                    "50"
                  ),
                  React.createElement(
                    "option",
                    { value: "100" },
                    "100"
                  ),
                  React.createElement(
                    "option",
                    { value: "200" },
                    "200"
                  )
                )
              ),
              React.createElement(
                "div",
                { className: "form-group col-md-3" },
                React.createElement(
                  "label",
                  null,
                  "Max entries per thread"
                ),
                React.createElement(
                  "select",
                  { value: this.state.maxEntries, onChange: this.handleMaxEntriesChange, className: "form-control" },
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
              React.createElement("input", { className: "form-control newThreadInput", onChange: this.handleTitleChange })
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
              "You can only create one thread per day "
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
    { className: "container menu p-3 avenir" },
    React.createElement(
      "h3",
      null,
      props.user
    ),
    React.createElement(
      "p",
      null,
      "Total Contributions: ",
      props.userScore
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
            { className: "p avenir font-weight-light" },
            this.props.title
          ),
          React.createElement(
            "span",
            { className: "float-right" },
            React.createElement(
              "div",
              null,
              "Entries: ",
              this.props.entryCount + "/" + this.props.maxEntries
            ),
            React.createElement(
              "div",
              { className: "font-italic text-secondary" },
              "Last Updated: ",
              this.props.createdAtHour,
              "  ",
              this.props.createdAtDay
            )
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
var PageButtons = function PageButtons(props) {
  if (props.currentDisplay == "OPEN") {
    return React.createElement(
      "div",
      { className: "row mt-2 text-center page-buttons" },
      React.createElement(
        "button",
        { className: "btn btn-light pageButtons col-md-6 bg-light-purp", onClick: props.pageBackwardOpen },
        React.createElement("i", { className: "fa fa-angle-double-left" }),
        "Back"
      ),
      React.createElement(
        "button",
        { className: "btn btn-light pageButtons col-md-6 bg-light-purp", onClick: props.pageForwardOpen },
        "Next",
        React.createElement("i", { className: "fa fa-angle-double-right" })
      )
    );
  } else {
    return React.createElement(
      "div",
      { className: "mt-2 text-center page-buttons" },
      React.createElement(
        "button",
        { className: "btn btn-light pageButtons col-md-6 bg-light-purp", onClick: props.pageBackwardClosed },
        React.createElement("i", { className: "fa fa-angle-double-left" }),
        "Back"
      ),
      React.createElement(
        "button",
        { className: "btn btn-light pageButtons col-md-6 bg-light-purp", onClick: props.pageForwardClosed },
        "Next",
        React.createElement("i", { className: "fa fa-angle-double-right" })
      )
    );
  }
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
    { className: "avenir" },
    React.createElement(PageHeading, { heading: props.title }),
    React.createElement(
      "div",
      { className: "threadsList" },
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
          title: thread.title,
          createdAtHour: thread.createdAt.slice(11, 19),
          createdAtDay: thread.createdAt.slice(0, 10),
          entryCount: thread.entryCount,
          maxEntries: thread.maxEntries,
          id: thread._id
        });
      })
    )
  );
};

ReactDOM.render(React.createElement(ThreadsWidget, null), document.getElementById('threadsPage'));

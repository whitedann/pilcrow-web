var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = React.Component;

var ThreadView = function (_Component) {
  _inherits(ThreadView, _Component);

  function ThreadView() {
    _classCallCheck(this, ThreadView);

    var _this = _possibleConstructorReturn(this, (ThreadView.__proto__ || Object.getPrototypeOf(ThreadView)).call(this));

    _this.state = {
      title: "No Title",
      threadID: "No thread ID",
      lastEntry: "No last Entry",
      lastAuthor: "No last Author",
      entriesCount: 0
    };
    _this.getStoryInfo = _this.getStoryInfo.bind(_this);
    return _this;
  }

  _createClass(ThreadView, [{
    key: "getStoryInfo",
    value: function getStoryInfo() {
      var _this2 = this;

      axios.get("http://" + window.location.hostname + ":3000" + window.location.pathname + "/data.json").then(function (response) {

        //Build full story from entries
        var entries = response.data.entries;
        var mergedString = [];
        entries.forEach(function (element) {
          mergedString.push(element.entry);
        });
        mergedString = mergedString.reverse();
        mergedString = mergedString.join(" ");

        //update
        _this2.setState({
          title: response.data.title,
          lastEntry: response.data.entries[0].entry,
          lastAuthor: response.data.entries[0].createdBy,
          maxChars: response.data.maxChars,
          entriesCount: response.data.entries.length,
          entriesLeft: response.data.maxEntries - response.data.entries.length,
          theStorySoFar: mergedString
        });
      }).catch(function (error) {
        console.log("Could not resolve thread", error);
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getStoryInfo();
    }
  }, {
    key: "render",
    value: function render() {

      return this.state.entriesLeft > 0 ? React.createElement(
        "div",
        { className: "row my-5" },
        React.createElement(StoryPane, {
          title: this.state.title,
          lastEntry: this.state.lastEntry,
          lastAuthor: this.state.lastAuthor,
          entriesLeft: this.state.entriesLeft,
          maxChars: this.state.maxChars
        }),
        React.createElement(RulesPane, {
          maxChars: this.state.maxChars,
          entriesLeft: this.state.entriesLeft
        })
      ) : React.createElement(
        "div",
        { className: "row my-5" },
        React.createElement(CompleteStory, {
          title: this.state.title,
          story: this.state.theStorySoFar,
          entriesCount: this.state.entriesCount
        })
      );
    }
  }]);

  return ThreadView;
}(Component);

var StoryPane = function (_Component2) {
  _inherits(StoryPane, _Component2);

  function StoryPane() {
    _classCallCheck(this, StoryPane);

    var _this3 = _possibleConstructorReturn(this, (StoryPane.__proto__ || Object.getPrototypeOf(StoryPane)).call(this));

    _this3.state = {
      content: "No content"
    };
    _this3.handleContributionChange = _this3.handleContributionChange.bind(_this3);
    _this3.submitContribution = _this3.submitContribution.bind(_this3);
    return _this3;
  }

  _createClass(StoryPane, [{
    key: "handleContributionChange",
    value: function handleContributionChange(event) {
      this.setState({
        content: event.target.value
      });
    }
  }, {
    key: "submitContribution",
    value: function submitContribution() {
      if (this.props.entriesLeft > 0) {
        axios.post("http://" + window.location.hostname + ":3000" + window.location.pathname, {
          content: this.state.content
        }).then(function (response) {
          console.log(response);
        }).catch(function (error) {
          console.log(error);
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "col-md-6" },
        React.createElement(
          "div",
          { className: "bg-light-purp p-3" },
          React.createElement(
            "h2",
            { className: "aventir" },
            this.props.title
          ),
          React.createElement(
            "p",
            null,
            "Last Entry:"
          ),
          React.createElement(
            "p",
            null,
            this.props.lastEntry
          ),
          React.createElement(
            "p",
            null,
            "By: ",
            this.props.lastAuthor
          ),
          React.createElement(
            "form",
            null,
            React.createElement(
              "div",
              { className: "form-group" },
              React.createElement(
                "label",
                { className: "mt-4" },
                "Write your contribution:"
              ),
              React.createElement("textarea", { className: "form-control", rows: "6", maxLength: this.props.maxChars, onChange: this.handleContributionChange })
            ),
            React.createElement(
              "button",
              { className: "btn btn-lg btn-dark", onClick: this.submitContribution },
              "Submit"
            )
          )
        )
      );
    }
  }]);

  return StoryPane;
}(Component);

var CompleteStory = function CompleteStory(props) {
  return React.createElement(
    "div",
    { className: "col-md-8 bg-light-purp rounded" },
    React.createElement(
      "h1",
      null,
      "Title: ",
      props.title
    ),
    React.createElement(
      "p",
      null,
      props.story
    ),
    React.createElement(
      "p",
      null,
      "Number of submitted entries: ",
      props.entriesCount
    )
  );
};

var RulesPane = function RulesPane(props) {
  return React.createElement(
    "div",
    { className: "col-md-6" },
    React.createElement(
      "div",
      { className: "bg-light-purp rounded p-3" },
      React.createElement(
        "p",
        { className: "rulesText" },
        "Thread Rules:"
      ),
      React.createElement(
        "p",
        null,
        "Maximum characters per entry: ",
        props.maxChars
      ),
      React.createElement(
        "p",
        null,
        "Entries left: ",
        props.entriesLeft
      )
    )
  );
};

ReactDOM.render(React.createElement(ThreadView, null), document.getElementById('singleThread'));
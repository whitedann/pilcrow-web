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
      entriesCount: 0,
      entriesLeft: 0,
      submitFlag: false,
      submissions: [],
      alreadyVoted: [],
      upvotes: [],
      downvotes: [],
      user: "",
      userID: "",
      content: "",
      timeLeft: 60.00
    };

    _this.getStoryInfo = _this.getStoryInfo.bind(_this);
    _this.getCurrentUserInfo = _this.getCurrentUserInfo.bind(_this);
    _this.submitConfirmation = _this.submitConfirmation.bind(_this);
    _this.handleContributionChange = _this.handleContributionChange.bind(_this);
    _this.submitContribution = _this.submitContribution.bind(_this);
    _this.voteOnSubmission = _this.voteOnSubmission.bind(_this);
    _this.startTimer = _this.startTimer.bind(_this);
    _this.countDown = _this.countDown.bind(_this);
    return _this;
  }

  _createClass(ThreadView, [{
    key: "getStoryInfo",
    value: function getStoryInfo() {
      var _this2 = this;

      axios.get("http://" + window.location.hostname + ":80" + window.location.pathname + "/data.json").then(function (response) {

        var userID = _this2.state.userID;
        var entriesList = response.data.entries;
        var alreadyVoted = [];
        var submissionIndex = [];
        var upvotes = [];
        var downvotes = [];
        //determine which post the user has already voted on.
        for (var entryIndex = 0; entryIndex < entriesList.length; entryIndex++) {
          downvotes[entryIndex] = 0;
          upvotes[entryIndex] = 0;
          if (entriesList[entryIndex].votes.length == 0) {
            alreadyVoted[entryIndex] = false;
          } else {

            //Determine if user has voted on each submission
            for (var voteIndex = 0; voteIndex < entriesList[entryIndex].votes.length; voteIndex++) {

              if (userID == entriesList[entryIndex].votes[voteIndex].userID) {
                alreadyVoted[entryIndex] = true;
              } else {
                alreadyVoted[entryIndex] = false;
              }

              //Get downvote and upvote totals
              if (entriesList[entryIndex].votes[voteIndex].value === -1) {
                downvotes[entryIndex]++;
              }
              if (entriesList[entryIndex].votes[voteIndex].value === 1) {
                upvotes[entryIndex]++;
              }
            }
          }
          submissionIndex[entryIndex] = entryIndex;
        }
        //Determine
        //update
        _this2.setState({
          title: response.data.title,
          threadID: response.data._id,
          lastEntry: response.data.entries[0].entry,
          lastAuthor: response.data.entries[0].createdBy,
          maxChars: response.data.maxChars,
          maxEntries: response.data.maxEntries,
          entriesCount: response.data.entries.length,
          entriesLeft: response.data.maxEntries - response.data.entries.length,
          submissions: response.data.entries.reverse(),
          alreadyVoted: alreadyVoted.reverse(),
          upvotes: upvotes.reverse(),
          downvotes: downvotes.reverse()
        });
      }).catch(function (error) {
        console.log("Could not resolve thread", error);
      });
    }
  }, {
    key: "getCurrentUserInfo",
    value: function getCurrentUserInfo() {
      var _this3 = this;

      axios.get("http://" + window.location.hostname + ":80/profile.json").then(function (response) {
        _this3.setState({
          user: response.data.username,
          userID: response.data._id
        });
      }).then(function () {
        return _this3.getStoryInfo();
      }).catch(function (error) {
        console.log("error finding current user", error);
      });
    }
  }, {
    key: "submitConfirmation",
    value: function submitConfirmation() {
      this.setState({
        submitFlag: true
      });
    }
  }, {
    key: "handleContributionChange",
    value: function handleContributionChange(event) {
      this.setState({
        content: event.target.value
      });
    }
  }, {
    key: "submitContribution",
    value: function submitContribution() {
      if (this.state.entriesLeft > 0) {
        axios.post("http://" + window.location.hostname + ":80/threads/" + this.state.threadID, {
          content: this.state.content
        }).then(function (response) {
          console.log(response);
        }).catch(function (error) {
          console.log(error.request);
        });
        this.submitConfirmation();
      }
    }
  }, {
    key: "voteOnSubmission",
    value: function voteOnSubmission(vote, submissionID) {
      axios.post("http://" + window.location.hostname + ":80/threads/" + this.state.threadID + "/entries/" + submissionID + "/" + vote).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error.request);
      });
    }
  }, {
    key: "startTimer",
    value: function startTimer() {
      if (this.state.timeLeft > 0) {
        setInterval(this.countDown, 1000);
      }
    }
  }, {
    key: "countDown",
    value: function countDown() {
      if (this.state.timeLeft > 0) {
        this.setState({
          timeLeft: this.state.timeLeft - 1
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getCurrentUserInfo();
      this.startTimer();
    }
  }, {
    key: "render",
    value: function render() {

      if (this.state.timeLeft <= 0 && !this.state.submitFlag) {
        return React.createElement(
          "div",
          { className: "row my-5" },
          React.createElement("div", { className: "col-md-2" }),
          React.createElement(
            "div",
            { className: "col-md-8 text-center jumbotron" },
            React.createElement(
              "div",
              { className: "h2" },
              "Your time has expired and your submission was lost."
            ),
            React.createElement(
              "div",
              { className: "h5" },
              "You need to write faster!"
            ),
            React.createElement(
              "p",
              { className: "mt-5 font-italic lead" },
              "Click below to return to the dashboard."
            ),
            React.createElement(
              "a",
              { href: "/threads" },
              React.createElement(
                "button",
                { className: "mt-5 btn btn-lg btn-warning text-center" },
                "Return to Dashboard"
              )
            )
          )
        );
      }

      if (this.state.submitFlag) {
        return React.createElement(
          "div",
          { className: "row my-5 x" },
          React.createElement("div", { className: "col-md-2" }),
          React.createElement(
            "div",
            { className: "col-md-8 text-center jumbotron" },
            React.createElement(
              "h1",
              { className: "display-4" },
              "Thank you for your contribution!"
            ),
            React.createElement(
              "p",
              { className: "mt-5 font-italic lead" },
              "You will be notified when the story has finished. Until then, what would you like to do?"
            ),
            React.createElement(
              "a",
              { href: "/threads" },
              React.createElement(
                "button",
                { className: "mt-5 btn btn-lg btn-warning text-center" },
                "Return to Dashboard"
              )
            )
          )
        );
      }

      return this.state.entriesLeft > 0 ? React.createElement(
        "div",
        { className: "row my-5" },
        React.createElement(StoryPane, {
          title: this.state.title,
          id: this.state.threadID,
          lastEntry: this.state.lastEntry,
          lastAuthor: this.state.lastAuthor,
          entriesLeft: this.state.entriesLeft,
          maxChars: this.state.maxChars,
          handleContributionChange: this.handleContributionChange,
          submitContribution: this.submitContribution
        }),
        React.createElement(RulesPane, {
          maxChars: this.state.maxChars,
          maxEntries: this.state.maxEntries,
          entriesLeft: this.state.entriesLeft,
          lastAuthor: this.state.lastAuthor,
          entriesCount: this.state.entriesCount,
          submitContribution: this.submitContribution,
          timeLeft: this.state.timeLeft
        })
      ) : React.createElement(
        "div",
        { className: "row my-5 x" },
        React.createElement(CompleteStory, {
          title: this.state.title,
          story: this.state.submissions,
          entriesCount: this.state.entriesCount,
          voteOnSubmission: this.voteOnSubmission,
          alreadyVoted: this.state.alreadyVoted,
          upvotes: this.state.upvotes,
          downvotes: this.state.downvotes
        })
      );
    }
  }]);

  return ThreadView;
}(Component);

var TimerPane = function (_Component2) {
  _inherits(TimerPane, _Component2);

  function TimerPane() {
    _classCallCheck(this, TimerPane);

    return _possibleConstructorReturn(this, (TimerPane.__proto__ || Object.getPrototypeOf(TimerPane)).call(this));
  }

  _createClass(TimerPane, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "mb-2" },
        React.createElement(
          "div",
          { className: "bg-light-purp rounded p-3 text-center" },
          React.createElement(
            "p",
            null,
            "You have 60 seconds to continue the story."
          ),
          React.createElement(
            "h3",
            { className: "avenir" },
            "Time Remaining:"
          ),
          React.createElement(
            "h4",
            { className: "text-danger" },
            this.props.timeLeft
          )
        )
      );
    }
  }]);

  return TimerPane;
}(Component);

var StoryPane = function (_Component3) {
  _inherits(StoryPane, _Component3);

  function StoryPane() {
    _classCallCheck(this, StoryPane);

    return _possibleConstructorReturn(this, (StoryPane.__proto__ || Object.getPrototypeOf(StoryPane)).call(this));
  }

  _createClass(StoryPane, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "col-md-8" },
        React.createElement(
          "div",
          { className: "bg-light-purp p-3 rounded" },
          React.createElement(
            "h5",
            { className: "font-italic" },
            "You are submitting to..."
          ),
          React.createElement(
            "h1",
            { className: "avenir font-weight-bold" },
            this.props.title
          ),
          React.createElement(
            "label",
            { className: "mt-4 h5 font-weight-light" },
            "This thread is currently locked for your use for the next 60 seconds."
          ),
          React.createElement(
            "label",
            { className: "h5 font-weight-light" },
            "Hit the submit button to submit your entry to the thread."
          ),
          React.createElement(
            "h5",
            { className: "font-wight-light mt-4" },
            "Last Entry"
          ),
          React.createElement(
            "div",
            { className: "bg-dark text-light text-center font-italic p-5 rounded" },
            "\"",
            this.props.lastEntry,
            "\" - ",
            this.props.lastAuthor
          ),
          React.createElement(
            "label",
            { className: "mt-4 h5" },
            "Write your entry here:"
          ),
          React.createElement(
            "form",
            null,
            React.createElement(
              "div",
              { className: "form-group" },
              React.createElement("textarea", { className: "form-control", rows: "13", maxLength: this.props.maxChars, onChange: this.props.handleContributionChange })
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
    { className: "col-md-12" },
    React.createElement(
      "div",
      { className: "bg-light-purp p-3 rounded" },
      React.createElement(
        "h1",
        { className: "avenir font-weight-bold" },
        props.title
      ),
      React.createElement(
        "h5",
        { className: "font-italic" },
        "By: ",
        React.createElement(
          "span",
          { className: "text-muted" },
          "user1, user2, user3, user4"
        )
      ),
      React.createElement(
        "h5",
        { className: "font-weight-bold mt-5" },
        "This thread is ",
        React.createElement(
          "span",
          { className: "text-danger" },
          "closed"
        ),
        " and you can now view all entries."
      ),
      React.createElement(
        "div",
        { className: "bg-dark text-light font-italic rounded" },
        props.story.map(function (submission, index) {
          return React.createElement(Submission, {
            key: submission._id.toString(),
            entryID: submission._id,
            content: submission.entry,
            votes: submission.entry.votes,
            author: submission.createdBy,
            voteOnSubmission: props.voteOnSubmission,
            alreadyVoted: props.alreadyVoted,
            submissionIndex: index,
            upvotes: props.upvotes,
            downvotes: props.downvotes
          });
        })
      ),
      React.createElement(
        "h5",
        { className: "font-weight-light mt-3" },
        "Final Entry Count: ",
        props.entriesCount
      )
    )
  );
};

var Submission = function (_Component4) {
  _inherits(Submission, _Component4);

  function Submission(props) {
    _classCallCheck(this, Submission);

    var _this6 = _possibleConstructorReturn(this, (Submission.__proto__ || Object.getPrototypeOf(Submission)).call(this, props));

    _this6.state = {
      submissionLocked: _this6.props.alreadyVoted[_this6.props.submissionIndex],
      upvotes: _this6.props.upvotes[_this6.props.submissionIndex],
      downvotes: _this6.props.downvotes[_this6.props.submissionIndex]
    };
    _this6.submitVote = _this6.submitVote.bind(_this6);
    return _this6;
  }

  _createClass(Submission, [{
    key: "submitVote",
    value: function submitVote(score, entryID) {
      this.props.voteOnSubmission(score, entryID);
      this.setState({
        submissionLocked: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this7 = this;

      if (this.state.submissionLocked) {
        return React.createElement(
          "div",
          { className: "btn-dark submission" },
          React.createElement(
            "div",
            { className: "row px-3" },
            React.createElement(
              "div",
              { className: "p avenir col-md-10 text-center py-3" },
              this.props.content
            ),
            React.createElement(
              "div",
              { className: "col-md-2 text-center py-2 rounded" },
              React.createElement(
                "button",
                { className: "btn btn-lg btn-block text-light bg-success", disabled: true },
                " +",
                this.state.upvotes,
                " "
              ),
              React.createElement(
                "button",
                { className: "btn btn-lg btn-block text-light bg-danger mt-0", disabled: true },
                " -",
                this.state.downvotes,
                " "
              )
            )
          )
        );
      } else {
        return React.createElement(
          "div",
          { className: "btn-dark submission" },
          React.createElement(
            "div",
            { className: "row px-3" },
            React.createElement(
              "div",
              { className: "p avenir col-md-10 text-center py-3" },
              this.props.content
            ),
            React.createElement(
              "div",
              { className: "col-md-2 py-2" },
              React.createElement(
                "button",
                { className: "btn btn-lg btn-block btn-success", onClick: function onClick() {
                    _this7.submitVote(1, _this7.props.entryID);
                  } },
                React.createElement("i", { className: "fa fa-arrow-alt-circle-up" })
              ),
              React.createElement(
                "button",
                { className: "btn btn-lg btn-block btn-danger mt-0", onClick: function onClick() {
                    _this7.submitVote(-1, _this7.props.entryID);
                  } },
                React.createElement("i", { className: "fas fa-arrow-alt-circle-down" })
              )
            )
          )
        );
      }
    }
  }]);

  return Submission;
}(Component);

var RulesPane = function RulesPane(props) {
  return React.createElement(
    "div",
    { className: "col-md-4" },
    React.createElement(TimerPane, {
      timeLeft: props.timeLeft
    }),
    React.createElement(
      "ul",
      { className: "list-group rounded" },
      React.createElement(
        "li",
        { className: "list-group-item avenir h3 text-center" },
        "Thread Info"
      ),
      React.createElement(
        "li",
        { className: "list-group-item bg-light-purp" },
        React.createElement("i", { className: "fa fa-lg fa-user-circle", "aria-hidden": "true" }),
        React.createElement(
          "span",
          { className: "mx-3" },
          "Current Entries"
        ),
        React.createElement(
          "span",
          { className: "float-right threadStats" },
          props.entriesCount
        )
      ),
      React.createElement(
        "li",
        { className: "list-group-item bg-light-purp" },
        React.createElement("i", { className: "fa fa-lg fa-font" }),
        React.createElement(
          "span",
          { className: "mx-3" },
          "Max Characters"
        ),
        React.createElement(
          "span",
          { className: "float-right threadStats" },
          props.maxChars
        )
      ),
      React.createElement(
        "li",
        { className: "list-group-item bg-light-purp" },
        React.createElement("i", { className: "fa fa-lg fa-list-alt", "aria-hidden": "true" }),
        React.createElement(
          "span",
          { className: "mx-3" },
          "Max Entries"
        ),
        React.createElement(
          "span",
          { className: "float-right threadStats" },
          props.maxEntries
        )
      ),
      React.createElement(
        "li",
        { className: "list-group-item bg-light-purp" },
        React.createElement("i", { className: "fa fa-lg fa-user-circle", "aria-hidden": "true" }),
        React.createElement(
          "span",
          { className: "mx-3" },
          "Last Edited By"
        ),
        React.createElement(
          "span",
          { className: "float-right threadStats" },
          props.lastAuthor
        )
      ),
      React.createElement(
        "li",
        { className: "list-group-item bg-light-purp text-center" },
        React.createElement(
          "button",
          { className: "btn btn-lg btn-block btn-success my-3", onClick: props.submitContribution },
          "Submit"
        )
      )
    )
  );
};

ReactDOM.render(React.createElement(ThreadView, null), document.getElementById('singleThread'));
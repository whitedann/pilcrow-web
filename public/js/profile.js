var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = React.Component;

var ProfileWidget = function (_Component) {
  _inherits(ProfileWidget, _Component);

  function ProfileWidget() {
    _classCallCheck(this, ProfileWidget);

    var _this = _possibleConstructorReturn(this, (ProfileWidget.__proto__ || Object.getPrototypeOf(ProfileWidget)).call(this));

    _this.state = {
      contributions: [],
      currentSelectionOfContributions: [],
      numberOfBatchesOfContributions: 1,
      maxPages: 0,
      showNextPageButton: false
    };
    _this.getUserContributions = _this.getUserContributions.bind(_this);
    _this.getMoreContributions = _this.getMoreContributions.bind(_this);
    _this.updateContributions = _this.updateContributions.bind(_this);
    return _this;
  }

  _createClass(ProfileWidget, [{
    key: "getUserContributions",
    value: function getUserContributions() {
      var _this2 = this;

      axios.get("http://" + window.location.hostname + ":3000/profile.json").then(function (response) {
        _this2.setState({
          contributions: response.data.contributions.reverse(),
          currentSelectionOfContributions: response.data.contributions.reverse().slice(0, 5),
          maxPages: response.data.contributions.length / 5
        });
      }).then(function () {
        //show nextpage button if only if max pages is greater than 1
        _this2.setState({
          showNextPageButton: _this2.state.maxPages > 1
        });
      }).catch(function (error) {
        console.log("error finding current user", error);
      });
    }
  }, {
    key: "getMoreContributions",
    value: function getMoreContributions() {
      var _this3 = this;

      this.setState({
        numberOfBatchesOfContributions: this.state.numberOfBatchesOfContributions + 1
      }, function () {
        _this3.updateContributions();
      });
    }
  }, {
    key: "updateContributions",
    value: function updateContributions() {
      this.setState({
        currentSelectionOfContributions: this.state.contributions.slice(0, 5 * this.state.numberOfBatchesOfContributions),
        showNextPageButton: this.state.maxPages > this.state.numberOfBatchesOfContributions
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getUserContributions();
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.showNextPageButton) {
        return React.createElement(
          "div",
          { className: "profileContainer mt-3" },
          React.createElement(
            "h3",
            { className: "avenir" },
            "Recent Contributions"
          ),
          this.state.currentSelectionOfContributions.map(function (cont) {
            return React.createElement(Contribution, {
              key: cont._id.toString(),
              content: cont.entry,
              storyID: cont.parentID,
              date: cont.createdAt,
              downvotes: cont.downvotes,
              upvotes: cont.upvotes
            });
          }),
          React.createElement(
            "div",
            { className: "row mt-2 text-center page-buttons" },
            React.createElement(
              "button",
              { className: "btn btn-light pageButtons col-md-12 bg-light-purp", onClick: this.getMoreContributions },
              "Show More",
              React.createElement(
                "div",
                null,
                React.createElement("i", { className: "fas fa-arrow-alt-circle-down" })
              )
            )
          )
        );
      } else {
        return React.createElement(
          "div",
          { className: "profileContainer mt-3" },
          React.createElement(
            "h3",
            { className: "avenir" },
            "Recent Contributions"
          ),
          this.state.currentSelectionOfContributions.map(function (cont) {
            return React.createElement(Contribution, {
              key: cont._id.toString(),
              content: cont.entry,
              storyID: cont.parentID,
              date: cont.createdAt,
              downvotes: cont.downvotes,
              upvotes: cont.upvotes
            });
          })
        );
      }
    }
  }]);

  return ProfileWidget;
}(Component);

var Contribution = function Contribution(props) {
  return React.createElement(
    "div",
    { className: "bg-light-blue rounded p-2 my-2 profileListing" },
    React.createElement(
      "p",
      { className: "font-italic text-secondary" },
      "Submitted on ",
      props.date.slice(11, 19),
      " ",
      props.date.slice(0, 10)
    ),
    React.createElement(
      "p",
      null,
      props.content
    ),
    React.createElement(
      "div",
      { className: "text-secondary" },
      React.createElement(
        "a",
        { href: "/threads/" + props.storyID },
        "View thread"
      ),
      React.createElement(
        "span",
        { className: "text-danger float-right ml-4" },
        props.downvotes
      ),
      React.createElement(
        "span",
        { className: "text-success float-right" },
        props.upvotes
      )
    )
  );
};

ReactDOM.render(React.createElement(ProfileWidget, null), document.getElementById('profileWidget'));
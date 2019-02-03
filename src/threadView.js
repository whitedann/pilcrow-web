const Component = React.Component;


class ThreadView extends Component {
  constructor(){
    super()
    this.state = {
      title: "No Title",
      threadID: "No thread ID",
      lastEntry: "No last Entry",
      lastAuthor: "No last Author",
      entriesCount: 0
    }
    this.getStoryInfo = this.getStoryInfo.bind(this);
  }

  getStoryInfo(){
    axios.get('http://localhost:3000' + window.location.pathname + "/data.json").
      then(response => {
        this.setState({
          title: response.data.title,
          lastEntry: response.data.entries[0].entry,
          lastAuthor: response.data.entries[0].createdBy,
          maxChars: response.data.maxChars,
          entriesLeft: response.data.maxEntries - response.data.entries.length
        })
      })
      .catch(error => {
        console.log("Could not resolve thread", error);
      });
  }

  componentDidMount(){
    this.getStoryInfo();
  }

  render(){
    return (
      <div className="row my-5">
        <StoryPane
          title={this.state.title}
          lastEntry={this.state.lastEntry}
          lastAuthor={this.state.lastAuthor}
          entriesLeft={this.state.entriesLeft}
        />
        <RulesPane
          maxChars={this.state.maxChars}
          entriesLeft={this.state.entriesLeft}
        />
      </div>
    )
  }
}

class StoryPane extends Component {
  constructor(){
    super()
    this.state = {
      content: "No content"
    }
    this.handleContributionChange = this.handleContributionChange.bind(this);
    this.submitContribution = this.submitContribution.bind(this);
  }

  handleContributionChange(event){
    this.setState({
      content: event.target.value
    });
  }

  submitContribution(){
    if(this.props.entriesLeft > 0){
      axios.post("http://localhost:3000" + window.location.pathname, {
        content: this.state.content
      })
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        });
    }
  }

  render(){
    return (
      <div className="col-md-6">
        <div className="bg-light-purp p-3">
          <h2 className="aventir">{this.props.title}</h2>
          <p>Last Entry:</p>
          <p>{this.props.lastEntry}</p>
          <p>By: {this.props.lastAuthor}</p>
          <form>
            <div className="form-group">
              <label className="mt-4">Write your contribution:</label>
              <textarea className="form-control" rows="6" onChange={this.handleContributionChange}></textarea>
            </div>
            <button className="btn btn-lg btn-dark" onClick={this.submitContribution}>Submit</button>
          </form>
        </div>
      </div>
    )
  }
}

const RulesPane = (props) => {
  return (
    <div className="col-md-6">
      <div className="bg-light-purp rounded p-3">
        <p className="rulesText">Thread Rules:</p>
        <p>Maximum characters per entry: {props.maxChars}</p>
        <p>Entries left: {props.entriesLeft}</p>
      </div>
    </div>
  )
}

ReactDOM.render(
  <ThreadView />,
  document.getElementById('singleThread')
);

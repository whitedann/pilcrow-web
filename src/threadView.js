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
    axios.get("http://" + window.location.hostname + ":3000" + window.location.pathname + "/data.json").
      then(response => {

        //Build full story from entries
        let entries = response.data.entries;
        let mergedString = [];
        entries.forEach(function(element){
          mergedString.push(element.entry);
        });
        mergedString = mergedString.reverse();
        mergedString = mergedString.join(" ");

        //update
        this.setState({
          title: response.data.title,
          lastEntry: response.data.entries[0].entry,
          lastAuthor: response.data.entries[0].createdBy,
          maxChars: response.data.maxChars,
          entriesCount: response.data.entries.length,
          entriesLeft: response.data.maxEntries - response.data.entries.length,
          theStorySoFar: mergedString
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

      this.state.entriesLeft > 0 ?

      <div className="row my-5">
        <StoryPane
          title={this.state.title}
          lastEntry={this.state.lastEntry}
          lastAuthor={this.state.lastAuthor}
          entriesLeft={this.state.entriesLeft}
          maxChars={this.state.maxChars}
        />
        <RulesPane
          maxChars={this.state.maxChars}
          entriesLeft={this.state.entriesLeft}
        />
      </div>

      :

      <div className="row my-5">
        <CompleteStory
          title={this.state.title}
          story={this.state.theStorySoFar}
          entriesCount={this.state.entriesCount}
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
      axios.post("http://" + window.location.hostname + ":3000" + window.location.pathname, {
        content: this.state.content
      })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
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
              <textarea className="form-control" rows="6" maxLength={this.props.maxChars} onChange={this.handleContributionChange}></textarea>
            </div>
            <button className="btn btn-lg btn-dark" onClick={this.submitContribution}>Submit</button>
          </form>
        </div>
      </div>
    )
  }
}

const CompleteStory = (props) => {
  return (
    <div className="col-md-8 bg-light-purp rounded">
      <h1>Title: {props.title}</h1>
      <p>{props.story}</p>
      <p>Number of submitted entries: {props.entriesCount}</p>
    </div>
  )
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

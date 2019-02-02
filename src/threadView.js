const Component = React.Component;


class ThreadView extends Component {
  constructor(){
    super()
    this.state = {
      title: "No Title",
      threadID: "",
      lastEntry: "No last Entry",
      lastAuthor: "No last Author"
    }
    this.getStoryInfo = this.getStoryInfo.bind(this);
  }

  getStoryInfo(){
    axios.get('http://localhost:3000' + window.location.pathname + "/data.json").
      then(response => {
        this.setState({
          title: response.data.title,
          lastEntry: response.data.entries[0].entry,
          lastAuthor: response.data.entries[0].createdBy
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
        />
        <RulesPane />
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

  render(){
    return (
      <div className="col-md-6">
        <div className="bg-light-purp p-3">
          <h2 className="aventir">{this.props.title}</h2>
          <p>Last Entry:</p>
          <p>{this.props.lastEntry}</p>
          <p>By: {this.props.lastAuthor}</p>
          <form>
            <label className="aventir h1">{this.props.title}</label>
            <div className="form-group">
              <label className="mt-4">Your contribution:</label>
              <textarea className="form-control" rows="6" onChange={this.handleContributionChange}></textarea>
            </div>
            <button className="btn btn-lg btn-dark" onClick={this.submitContribution}>Submit</button>
          </form>
        </div>
      </div>
    )
  }
}

const RulesPane = () => {
  return (
    <div className="col-md-6">
      <div className="bg-light-purp rounded p-3">
        <p className="rulesText">Thread Rules:</p>
        <p>Maximum characters per entry: 50 </p>
        <p>Entries left: 50</p>
      </div>
    </div>
  )
}

ReactDOM.render(
  <ThreadView />,
  document.getElementById('singleThread')
);

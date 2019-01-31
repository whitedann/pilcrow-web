const Component = React.Component;

class ThreadsWidget extends Component {
  constructor(){
    super()
    this.state = {
      threads: [],
      title: "Loading...",
      user: "Waiting...",
      submissions: [],
      leftColTitle: "",
      rightColTitle: "",
      createPostClick: false
    }
    //Bind the functions to the instance of this component.
    this.generateClosedThreads = this.generateClosedThreads.bind(this);
    this.generateOpenThreads = this.generateOpenThreads.bind(this);
    this.generateYourPastThreads = this.generateYourPastThreads.bind(this);
    this.getCurrentUserInfo = this.getCurrentUserInfo.bind(this);
    this.createNewThreadForm = this.createNewThreadForm.bind(this);
  }

  getCurrentUserInfo(){
    axios.get('http://localhost:3000/profile.json')
      .then(response => {
        this.setState({
          user: response.data.username
        });
      })
      .catch(error => {
        console.log("error finding current user", error);
      });
  }

  generateYourPastThreads(){
    axios.get('http://localhost:3000/profile.json')
      .then(response => {
        this.setState({
          submissions: response.data.contributions,
          threads: [],
          title: "Your Threads",
          leftColTitle: "Entry",
          rightColTitle: "",
          createPostClicked: false
        });
      })
      .catch(error => {
        console.log("error fetching user submissions")
      });
  }

  // For rendering list of incomplete threads.
  // Check threads.js for get method of /threads/closed.json
  generateClosedThreads(){
      axios.get('http://localhost:3000/threads/closed.json')
        .then(response => {
          this.setState({
            threads: response.data,
            submissions: [],
            title: "Closed Threads",
            leftColTitle: "Title",
            rightColTitle: "Total Contributions",
            createPostClick: false
          });
        })
        .catch(error => {
          console.log("error fetching completed threads", error);
        });
  }

  // For rendering list of closed (completed) threads
  // Check threads.js for get method of /threads/open.json
  generateOpenThreads(){
    axios.get('http://localhost:3000/threads/open.json')
      .then(response => {
        this.setState({
          threads: response.data,
          submissions: [],
          title: "Open Threads",
          leftColTitle: "Most Recent Entry",
          rightColTitle: "Entry Count",
          createPostClicked: false
        });
      })
      .catch(error => {
        console.log("error fetching completed threads", error);
      });
  }

  createNewThreadForm(){
    this.setState({
      createPostClicked: true,
      title: "Start a New Thread"
    });
  }

  componentDidMount(){
    this.getCurrentUserInfo();
    this.generateOpenThreads();
  }

  render(){
    return (
      <div className="row my-5">
        <SideBar
          generateOpenThreads={this.generateOpenThreads}
          generateClosedThreads={this.generateClosedThreads}
          generateYourPastThreads={this.generateYourPastThreads}
          createNewThreadForm={this.createNewThreadForm}
          user={this.state.user}
        />
        {
          this.state.createPostClicked ?

          <NewPostForm
            title={this.state.title}
          />

          :

          <ThreadsList
            threads={this.state.threads}
            submissions={this.state.submissions}
            title={this.state.title}
            leftColTitle={this.state.leftColTitle}
            rightColTitle={this.state.rightColTitle}
          />
        }
      </div>
    )
  }
}

class NewPostForm extends Component {
  constructor(){
    super()
    this.state = {
      maxChars: 10,
      maxEntries: 10,
      currentChars: 0,
      currentString: "",
      title: ""
    };
    this.makeAndRouteToNewThread = this.makeAndRouteToNewThread.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
  }

  makeAndRouteToNewThread(){
    const my = this;
    axios.post('http://localhost:3000/threads/', {
      content: my.state.currentString,
      maxEntries: my.state.maxEntries,
      title: my.state.title
    })
      .then(response => {
          console.log(response);
      })
      .catch(error => {
        console.log(error)
      });
  }

  handleChange(event){
    this.setState({maxChars : event.target.value})
  }

  handleTextAreaChange(event){
    this.setState({
      currentChars : event.target.value.length,
      currentString : event.target.value,
    });
  }

  render(){
    return (
      <div className="container col-md-9">
        <PageHeading heading={this.props.title}/>
        <div className="bg-light-purp p-3">
          <form>
            <div className="form-row">
              <div className="form-group col-md-3">
                <label>Max characters per entry</label>
                <select value={this.state.maxChars} onChange={this.handleChange} className="form-control">
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
              <div className="form-group col-md-3">
                <label>Entry Limit</label>
                <select className="form-control">
                  <option>10</option>
                  <option>100</option>
                </select>
              </div>
              <div className="col-md-6"></div>
            </div>
            <div className="form-group">
              <label className="aventir">Give the thread a title:</label>
              <input className="form-control newThreadInput"></input>
            </div>
            <div className="form-group">
              <label className="mt-4">Write the first entry:</label>
              <textarea className="form-control" rows="6" maxLength={this.state.maxChars} onChange={this.handleTextAreaChange}></textarea>
            </div>
            <p>{this.state.currentChars}/{this.state.maxChars}</p>
          <button className="btn btn-lg btn-dark text-center" onClick={this.makeAndRouteToNewThread}>
            Create
          </button>
          <p className="mt-1 font-italic">Note: You can only create one thread per day </p>
          </form>
        </div>
      </div>
    );
  }
}

const SideBar = (props) => {
    return (
        <div className="col-md-3 menu py-3 avenir">
          <h3>{props.user}</h3>
          <p>Score: 9</p>
          <hr className="menu-divider mt-0"></hr>
          <button className="btn btn-block btn-primary mt-3 py-2" onClick={props.generateClosedThreads}>
            Closed Threads
          </button>
          <button className="btn btn-block btn-warning py-2" onClick={props.generateOpenThreads}>
            Open Threads
          </button>
          <button className="btn btn-block btn-warning py-2" onClick={props.generateYourPastThreads}>
            Your Contributions
          </button>
          <button className="btn btn-block btn-success py-3 mt-5" onClick={props.createNewThreadForm}>
            Start A New Thread
          </button>
        </div>
    )
}

class ThreadListing extends Component {
  constructor(){
    super()
  }

  render() {
    return (
        <a href={'/threads/' + this.props.id}>
          <button className="btn btn-light thread m-1 p-2">
              <span className="p font-weight-light">
                { this.props.latestEntry }
              </span>
              <span className="entriesCount float-right">
                { this.props.entryCount + "/10"}
              </span>
          </button>
        </a>
    );
  }
}

const SubmissionListing = (props) => {
  return (
    <a href={'/threads/' + props.parentID}>
      <button className="btn btn-light thread m-1 p-2">
        <span className="p font-weight-light">
          {props.entry}
        </span>
      </button>
    </a>
  )
}

{/*Stateless*/}
const ListHeading = (props) => {
  return (
    <div className="m-1">
      <span className="h5 font-weight-light">
        {props.leftColTitle}
      </span>
      <span className="h5 float-right font-weight-light">
        {props.rightColTitle}
      </span>
    </div>
  )
}

{/*Stateless*/}
const PageHeading = (props) => {
  return (
    <div className="font-weight-bold thread-title avenir">
      { props.heading }
    </div>
  )
}

const ThreadsList = (props) => {
    return (
        <div className="container col-md-9">
          <PageHeading heading={props.title}/>
          <div className="threadsList">
            <ListHeading
              leftColTitle = {props.leftColTitle}
              rightColTitle = {props.rightColTitle}
            />
            {props.submissions.map( submission =>
              <SubmissionListing
                key={submission._id.toString()}
                entry={submission.entry}
                parentID={submission.parentID}
              />
            )}
            {props.threads.map( thread =>
              <ThreadListing
                key = {thread._id.toString()}
                latestEntry = {thread.entries[0].entry}
                entryCount = {thread.entryCount}
                id = {thread._id}
              />
            )}
          </div>
        </div>
      );
}

ReactDOM.render(
  <ThreadsWidget />,
  document.getElementById('reactEle')
);

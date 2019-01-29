const Component = React.Component;

class ThreadsWidget extends Component {
  constructor(){
    super()
    this.state = {
      threads: [],
      title: "Loading...",
      user: "Waiting...",
      submissions: []
    }
    //Bind the functions to the instance of this component.
    this.generateClosedThreads = this.generateClosedThreads.bind(this);
    this.generateOpenThreads = this.generateOpenThreads.bind(this);
    this.generateYourPastThreads = this.generateYourPastThreads.bind(this);
    this.getCurrentUserInfo = this.getCurrentUserInfo.bind(this);
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
          title: "Your Threads"
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
            title: "Closed Threads"
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
          title: "Open Threads"
        });
      })
      .catch(error => {
        console.log("error fetching completed threads", error);
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
          user={this.state.user}
        />
        <ThreadsList
          threads={this.state.threads}
          submissions={this.state.submissions}
          title={this.state.title}
        />
      </div>
    )
  }
}

const SideBar = (props) => {
    return (
        <div className="col-md-3 menu py-3">
          <h5>{props.user}</h5>
          <hr className="menu-divider mt-0"></hr>
          <button className="btn btn-block btn-primary mt-3 py-2" onClick={props.generateClosedThreads}>
            Closed Threads
          </button>
          <button className="btn btn-block btn-warning py-2" onClick={props.generateOpenThreads}>
            Open Threads
          </button>
          <button className="btn btn-block btn-warning py-y" onClick={props.generateYourPastThreads}>
            Your Contributions
          </button>
          <button className="btn btn-block btn-success py-3 mt-5">
            Start A New Thread
          </button>
        </div>
    )
}

class ThreadListing extends React.Component {
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
const ListHeading = () => {
  return (
    <div className="m-1">
      <span className="h5 font-weight-light">
        Last Contribution
      </span>
      <span className="h5 float-right font-weight-light">
        Entry Count
      </span>
    </div>
  )
}

{/*Stateless*/}
const PageHeading = (props) => {
  return (
    <div className="font-weight-bold thread-title">
      { props.heading }
    </div>
  )
}

const ThreadsList = (props) => {
    return (
        <div className="container col-md-9">
          <PageHeading heading={props.title}/>
          <div className="threadsList">
            <ListHeading />
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

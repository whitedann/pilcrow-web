  const Component = React.Component;

class ThreadsWidget extends Component {
  constructor(){
    super()
    this.state = {
      threads: [],
      title: "Loading...",
      user: "Waiting...",
      userScore: 0,
      submissions: [],
      createPostClick: false,
      currentPageOpen: 0,
      currentPageClosed: 0,
      currentDisplay: "NONE"
    }
    //Bind the functions to the instance of this component.
    this.generateClosedThreads = this.generateClosedThreads.bind(this);
    this.generateOpenThreads = this.generateOpenThreads.bind(this);
    this.generateYourPastThreads = this.generateYourPastThreads.bind(this);
    this.getCurrentUserInfo = this.getCurrentUserInfo.bind(this);
    this.createNewThreadForm = this.createNewThreadForm.bind(this);
    this.pageForwardOpen = this.pageForwardOpen.bind(this);
    this.pageBackwardOpen = this.pageBackwardOpen.bind(this);
    this.pageForwardClosed = this.pageForwardClosed.bind(this);
    this.pageBackwardClosed = this.pageBackwardClosed.bind(this);
  }

  getCurrentUserInfo(){
    axios.get("http://" + window.location.hostname + ":3000/profile.json")
      .then(response => {
        this.setState({
          user: response.data.username,
          userScore: response.data.contributionsCount
        });
      })
      .catch(error => {
        console.log("error finding current user", error);
      });
  }

  generateYourPastThreads(){
    axios.get("http://" + window.location.hostname + ":3000/profile.json")
      .then(response => {
        this.setState({
          submissions: response.data.contributions,
          threads: [],
          title: "Browse Your Contributions",
          createPostClicked: false
        });
      })
      .catch(error => {
        console.log("error fetching past threads")
      });
  }

  // For rendering list of incomplete threads.
  // Check threads.js for get method of /threads/closed.json
  generateClosedThreads(){
      axios.get("http://" + window.location.hostname + ":3000" + window.location.pathname + '/closed?page=' + this.state.currentPageClosed)
        .then(response => {
          this.setState({
            threads: response.data,
            submissions: [],
            title: "Browse Closed Threads",
            createPostClick: false,
            currentDisplay: "CLOSED"
          });
        })
        .then( () => {
          if(this.state.threads.length == 0){
            this.pageBackwardClosed();
          }
        })
        .catch(error => {
          console.log("error fetching completed threads", error);
        });
  }

  // For rendering list of open threads
  // Check threads.js for get method of /threads/open.json
  generateOpenThreads(){
    axios.get("http://" + window.location.hostname + ":3000" + window.location.pathname + '/open?page=' + this.state.currentPageOpen)
      .then(response => {
        this.setState({
          threads: response.data,
          submissions: [],
          title: "Browse Open Threads",
          createPostClicked: false,
          currentDisplay: "OPEN"
        });
      })
      .then( () => {
        if(this.state.threads.length == 0){
          this.pageBackwardOpen();
        }
      })
      .catch(error => {
        console.log("error fetching completed threads", error);
      });
  }

  pageForwardOpen(){
    this.setState({
      currentPageOpen: this.state.currentPageOpen + 1
    }, () => {
      this.generateOpenThreads();
    });
  }

  pageBackwardOpen(){
    if(this.state.currentPageOpen > 0){
      this.setState({
        currentPageOpen: this.state.currentPageOpen - 1
      }, () => {
        this.generateOpenThreads( () => {
          console.log(thisstate.currentDisplay);
        });
      });
    }
  }

  pageForwardClosed(){
    this.setState({
      currentPageClosed: this.state.currentPageClosed + 1
    }, () => {
      this.generateClosedThreads( () => {
        console.log(this.state.currentDisplay);
      });
    });
  }

  pageBackwardClosed(){
    if(this.state.currentPageClosed > 0){
      this.setState({
        currentPageClosed: this.state.currentPageClosed - 1
      }, () => {
        this.generateClosedThreads( () => {
          console.log(this.state.currentDisplay);
        });
      });
    }
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
      <div className="row my-5 x">
        <div className="col-md-3">
          <SideBar
            generateOpenThreads={this.generateOpenThreads}
            generateClosedThreads={this.generateClosedThreads}
            generateYourPastThreads={this.generateYourPastThreads}
            createNewThreadForm={this.createNewThreadForm}
            user={this.state.user}
            userScore={this.state.userScore}
          />
        </div>
        {
          this.state.createPostClicked ?

          <NewPostForm
            title={this.state.title}
          />

          :
          <div className="col-md-9">
            <ThreadsList
              threads={this.state.threads}
              submissions={this.state.submissions}
              title={this.state.title}
              pageForwardOpen={this.pageForwardOpen}
              pageBackwardOpen={this.pageBackwardOpen}
              pageForwardClosed={this.pageForwardClosed}
              pageBackwardClosed={this.pageBackwardClosed}
              currentDisplay={this.state.currentDisplay}
            />
            <PageButtons
              pageForwardOpen={this.pageForwardOpen}
              pageBackwardOpen={this.pageBackwardOpen}
              pageForwardClosed={this.pageForwardClosed}
              pageBackwardClosed={this.pageBackwardClosed}
              currentDisplay={this.state.currentDisplay}
            />
          </div>
        }
      </div>
    )
  }
}

class NewPostForm extends Component {
  constructor(){
    super()
    this.state = {
      maxChars: 1,
      maxEntries: 10,
      currentChars: 0,
      currentString: "",
      title: "(No Title)"
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.makeAndRouteToNewThread = this.makeAndRouteToNewThread.bind(this);
    this.handleMaxCharChange = this.handleMaxCharChange.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.handleMaxEntriesChange = this.handleMaxEntriesChange.bind(this);
  }

  makeAndRouteToNewThread(){
    //declare instance of this component to get around scoping issues of "this"
    const my = this;
    axios.post("http://" + window.location.hostname + ":3000" + window.location.pathname, {
      content: my.state.currentString,
      maxEntries: my.state.maxEntries,
      title: my.state.title,
      maxChars: my.state.maxChars,
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error)
      });
  }

  handleTitleChange(event){
    this.setState({title: event.target.value})
  }

  handleMaxCharChange(event){
    this.setState({maxChars : event.target.value});
  }

  handleMaxEntriesChange(event){
    this.setState({maxEntries: event.target.value});
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
                <select value={this.state.maxChars} onChange={this.handleMaxCharChange} className="form-control">
                  <option value="1">1</option>
                  <option value="10">10</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                </select>
              </div>
              <div className="form-group col-md-3">
                <label>Max entries per thread</label>
                <select value={this.state.maxEntries} onChange={this.handleMaxEntriesChange} className="form-control">
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
              <div className="col-md-6"></div>
            </div>
            <div className="form-group">
              <label className="handwritten">Give the thread a title:</label>
              <input className="form-control newThreadInput" onChange={this.handleTitleChange}></input>
            </div>
            <div className="form-group">
              <label className="mt-4">Write the first entry:</label>
              <textarea className="form-control" rows="6" maxLength={this.state.maxChars} onChange={this.handleTextAreaChange}></textarea>
            </div>
            <p>{this.state.currentChars}/{this.state.maxChars}</p>
            <button className="btn btn-lg btn-dark text-center" onClick={this.makeAndRouteToNewThread}>
              Create
            </button>
            <p className="mt-1 font-italic">You can only create one thread per day </p>
          </form>
        </div>
      </div>
    );
  }
}

const SideBar = (props) => {
    return (
        <div className="container menu p-3 avenir">
          <h3>{props.user}</h3>
          <p>Total Contributions: {props.userScore}</p>
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
              <span className="p text-formal font-weight-light">
                { this.props.title }
              </span>
              <span className="float-right">
                <div>
                  Entries: { this.props.entryCount + "/" + this.props.maxEntries}
                </div>
                <div className="font-italic text-secondary">
                  Last Updated: {this.props.createdAtHour}  {this.props.createdAtDay}
                </div>
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
const PageButtons = (props) => {
  if(props.currentDisplay == "OPEN"){
    return (
      <div className="row mt-2 text-center page-buttons">
        <button className="btn btn-light pageButtons col-md-6 bg-light-purp" onClick={props.pageBackwardOpen}><i className="fa fa-angle-double-left"></i>Back</button>
        <button className="btn btn-light pageButtons col-md-6 bg-light-purp" onClick={props.pageForwardOpen}>Next<i className="fa fa-angle-double-right"></i></button>
      </div>
    )
  }
  else {
    return (
      <div className="mt-2 text-center page-buttons">
        <button className="btn btn-light pageButtons col-md-6 bg-light-purp" onClick={props.pageBackwardClosed}><i className="fa fa-angle-double-left"></i>Back</button>
        <button className="btn btn-light pageButtons col-md-6 bg-light-purp" onClick={props.pageForwardClosed}>Next<i className="fa fa-angle-double-right"></i></button>
      </div>
    )
  }
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
        <div className="handwritten">
          <PageHeading heading={props.title}/>
          <div className="threadsList">
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
                title = {thread.title}
                createdAtHour = {thread.createdAt.slice(11,19)}
                createdAtDay   = {thread.createdAt.slice(0,10)}
                entryCount = {thread.entryCount}
                maxEntries = {thread.maxEntries}
                id = {thread._id}
              />
            )}
          </div>
        </div>
      );
}

ReactDOM.render(
  <ThreadsWidget />,
  document.getElementById('threadsPage')
);

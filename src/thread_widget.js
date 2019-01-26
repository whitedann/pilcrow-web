{/*const threads = [
  {
    title: "The Fox and the Hound",
    entryCount: 23,
    id: 1
  },
  {
    title: "I wonder if this will fit in the box",
    entryCount: 65,
    id: 2
  },
  {
    title: "Another Story About Dragons",
    entryCount: 32,
    id: 3
  },
  {
    title: "Thomas the Tank",
    entryCount: 6,
    id: 4
  },
  {
    title: "Lilo And Stitches",
    entryCount: 23,
    id: 5
  },
  {
    title: "What is your favorite flavor of mouse?",
    entryCount: 8,
    id: 6
  },
  {
    title: "The Fox and the Hound",
    entryCount: 23,
    id: 7
  },
  {
    title: "The Fox and the Hound",
    entryCount: 23,
    id: 8
  },
  {
    title: "The Fox and the Hound",
    entryCount: 23,
    id: 9
  },
  {
    title: "The Fox and the Hound",
    entryCount: 23,
    id: 10
  }
] */}

class ThreadListing extends React.Component {
  constructor(){
    super()
    this.state = {
      entryCount: 0
    };
  }

  render() {
    return (
      <button className="btn btn-light thread m-1 p-2" onClick={this.routeChange}>
        <span className="p font-weight-light">
          { this.props.firstEntry }
          </span>
        <span className="entriesCount float-right">
          { this.props.entryCount + "/10"}
        </span>
      </button>
    );
  }
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

class ThreadsList extends React.Component  {
  constructor(){
    // Remember, calling super allows this "dot" notation.
    super()
    this.state = {
      threads: [],
    };
  }

  // For rendering list of incomplete threads.
  // Check threads.js for get method of /threads/closed.json
  generateCompletedThreads(){
      axios.get('http://localhost:3000/threads/closed.json')
        .then(response => {
          this.setState({
            threads: response.data
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
          threads: response.data
        });
      })
      .catch(error => {
        console.log("error fetching completed threads", error);
      });
  }

  componentDidMount(){
    this.generateOpenThreads();
  }

  render(){
    return (
        <div className="container">
          <PageHeading heading="All Threads"/>
          <div className="threadsList">
            <ListHeading />
            {this.state.threads.map( thread =>
              <ThreadListing
                key = {thread._id.toString()}
                firstEntry = {thread.entries[0].entry}
                entryCount = {thread.entryCount}
              />
            )}
          </div>
        </div>
      );
    }
  }

ReactDOM.render(
  <ThreadsList />,
  document.getElementById('reactEle')
);

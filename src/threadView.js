const Component = React.Component;

class ThreadView extends Component {
  constructor(){
    super()
    this.state = {
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
    }

    this.getStoryInfo = this.getStoryInfo.bind(this);
    this.getCurrentUserInfo = this.getCurrentUserInfo.bind(this);
    this.submitConfirmation = this.submitConfirmation.bind(this);
    this.handleContributionChange = this.handleContributionChange.bind(this);
    this.submitContribution = this.submitContribution.bind(this);
    this.voteOnSubmission = this.voteOnSubmission.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  getStoryInfo(){
    axios.get("http://" + window.location.hostname + ":80" + window.location.pathname + "/data.json").
      then(response => {

        let userID = this.state.userID;
        let entriesList = response.data.entries;
        let alreadyVoted = [];
        let submissionIndex = [];
        let upvotes = [];
        let downvotes = [];
        //determine which post the user has already voted on.
        for(let entryIndex = 0; entryIndex < entriesList.length; entryIndex++){
          downvotes[entryIndex] = 0;
          upvotes[entryIndex] = 0;
          if(entriesList[entryIndex].votes.length == 0){
            alreadyVoted[entryIndex] = false;
          }
          else {

            //Determine if user has voted on each submission
            for(let voteIndex = 0; voteIndex < entriesList[entryIndex].votes.length; voteIndex++){

              if(userID == entriesList[entryIndex].votes[voteIndex].userID){
                alreadyVoted[entryIndex] = true;
              }
              else{
                alreadyVoted[entryIndex] = false;
              }

              //Get downvote and upvote totals
              if(entriesList[entryIndex].votes[voteIndex].value === -1){
                downvotes[entryIndex]++;
              }
              if(entriesList[entryIndex].votes[voteIndex].value === 1){
                upvotes[entryIndex]++;
              }
            }
          }
          submissionIndex[entryIndex] = entryIndex;
        }
        //Determine
        //update
        this.setState({
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
        })
      })
      .catch(error => {
        console.log("Could not resolve thread", error);
      });
  }

  getCurrentUserInfo(){
    axios.get("http://" + window.location.hostname + ":80/profile.json")
      .then(response => {
        this.setState({
          user: response.data.username,
          userID: response.data._id
        });
      })
      .then(() => {
        return this.getStoryInfo();
      })
      .catch(error => {
        console.log("error finding current user", error);
      });
  }

  submitConfirmation(){
    this.setState({
      submitFlag: true
    });
  }

  handleContributionChange(event){
    this.setState({
      content: event.target.value
    });
  }

  submitContribution(){
    if(this.state.entriesLeft > 0){
      axios.post("http://" + window.location.hostname + ":80/threads/" + this.state.threadID, {
        content: this.state.content
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error.request);
      });
      this.submitConfirmation();
    }
  }

  voteOnSubmission(vote, submissionID){
    axios.post("http://" + window.location.hostname + ":80/threads/" + this.state.threadID + "/entries/" + submissionID + "/" + vote)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error.request);
    });
  }

  startTimer() {
   if (this.state.timeLeft > 0) {
     setInterval(this.countDown, 1000);
   }
  }

  countDown() {
    if(this.state.timeLeft > 0){
      this.setState({
        timeLeft: this.state.timeLeft - 1
      });
    }
  }

  componentDidMount(){
    this.getCurrentUserInfo();
    this.startTimer();
  }

  render(){

    if(this.state.timeLeft <= 0 && !this.state.submitFlag){
      return (
        <div className="row my-5">
          <div className="col-md-2">
          </div>
          <div className="col-md-8 text-center jumbotron">
            <div className="h2">Your time has expired and your submission was lost.</div>
            <div className="h5">You need to write faster!</div>
            <p className="mt-5 font-italic lead">Click below to return to the dashboard.</p>
            <a href="/threads">
              <button className="mt-5 btn btn-lg btn-warning text-center">
                Return to Dashboard
              </button>
            </a>
          </div>
        </div>
      )
    }

    if(this.state.submitFlag){
      return (
        <div className="row my-5 x">
          <div className="col-md-2">
          </div>
          <div className="col-md-8 text-center jumbotron">
            <h1 className="display-4">Thank you for your contribution!</h1>
            <p className="mt-5 font-italic lead">You will be notified when the story has finished. Until then, what would you like to do?</p>
            <a href="/threads">
              <button className="mt-5 btn btn-lg btn-warning text-center">
                Return to Dashboard
              </button>
            </a>
          </div>
        </div>
      )
    }

    return (

        this.state.entriesLeft > 0 ?

        <div className="row my-5">
          <StoryPane
            title={this.state.title}
            id={this.state.threadID}
            lastEntry={this.state.lastEntry}
            lastAuthor={this.state.lastAuthor}
            entriesLeft={this.state.entriesLeft}
            maxChars={this.state.maxChars}
            handleContributionChange={this.handleContributionChange}
            submitContribution={this.submitContribution}
            />
          <RulesPane
            maxChars={this.state.maxChars}
            maxEntries={this.state.maxEntries}
            entriesLeft={this.state.entriesLeft}
            lastAuthor={this.state.lastAuthor}
            entriesCount={this.state.entriesCount}
            submitContribution={this.submitContribution}
            timeLeft={this.state.timeLeft}
          />
        </div>

        :

        <div className="row my-5 x">
          <CompleteStory
            title={this.state.title}
            story={this.state.submissions}
            entriesCount={this.state.entriesCount}
            voteOnSubmission={this.voteOnSubmission}
            alreadyVoted={this.state.alreadyVoted}
            upvotes={this.state.upvotes}
            downvotes={this.state.downvotes}
          />
        </div>
    )
  }
}

class TimerPane extends Component {
  constructor(){
    super()
  }

  render(){
    return(
      <div className="mb-2">
        <div className="bg-light-purp rounded p-3 text-center">
          <p>You have 60 seconds to continue the story.</p>
          <h3 className="avenir">
            Time Remaining:
          </h3>
          <h4 className="text-danger">
            {this.props.timeLeft}
          </h4>
        </div>
      </div>
    )
  }
}

class StoryPane extends Component {
  constructor(){
    super()
  }

  render(){
    return (
      <div className="col-md-8">
        <div className="bg-light-purp p-3 rounded">
          <h5 className="font-italic">You are submitting to...</h5>
          <h1 className="avenir font-weight-bold">{this.props.title}</h1>
          <label className="mt-4 h5 font-weight-light">This thread is currently locked for your use for the next 60 seconds.</label>
          <label className="h5 font-weight-light">Hit the submit button to submit your entry to the thread.</label>
          <h5 className="font-wight-light mt-4">Last Entry</h5>
          <div className="bg-dark text-light text-center font-italic p-5 rounded">
            "{this.props.lastEntry}" - {this.props.lastAuthor}
          </div>
          <label className="mt-4 h5">Write your entry here:</label>
          <form>
            <div className="form-group">
              <textarea className="form-control" rows="13" maxLength={this.props.maxChars} onChange={this.props.handleContributionChange}></textarea>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const CompleteStory = (props) => {
  return (
    <div className="col-md-12">
      <div className="bg-light-purp p-3 rounded">
        <h1 className="avenir font-weight-bold">{props.title}</h1>
        <h5 className="font-italic">By: <span className="text-muted">user1, user2, user3, user4</span></h5>
        <h5 className="font-weight-bold mt-5">This thread is <span className="text-danger">closed</span> and you can now view all entries.</h5>
        <div className="bg-dark text-light font-italic rounded">
          {props.story.map( (submission, index) =>
            <Submission
              key = {submission._id.toString()}
              entryID = {submission._id}
              content = {submission.entry}
              votes = {submission.entry.votes}
              author = {submission.createdBy}
              voteOnSubmission = {props.voteOnSubmission}
              alreadyVoted = {props.alreadyVoted}
              submissionIndex = {index}
              upvotes = {props.upvotes}
              downvotes = {props.downvotes}
              />
          )}
        </div>
        <h5 className="font-weight-light mt-3">Final Entry Count: {props.entriesCount}</h5>
      </div>
    </div>
  )
}

class Submission extends Component {
  constructor(props){
    super(props);
    this.state = {
      submissionLocked: this.props.alreadyVoted[this.props.submissionIndex],
      upvotes: this.props.upvotes[this.props.submissionIndex],
      downvotes: this.props.downvotes[this.props.submissionIndex]
    }
    this.submitVote = this.submitVote.bind(this);
  }

  submitVote(score, entryID){
    this.props.voteOnSubmission(score, entryID);
    this.setState({
      submissionLocked: true
    });
  }

  render(){
    if(this.state.submissionLocked){
      return (
        <div className="btn-dark submission">
          <div className="row px-3">
            <div className="p avenir col-md-10 text-center py-3">
              {this.props.content}
            </div>
            <div className="col-md-2 text-center py-2 rounded">
              <button className="btn btn-lg btn-block text-light bg-success" disabled> +{this.state.upvotes} </button>
              <button className="btn btn-lg btn-block text-light bg-danger mt-0" disabled> -{this.state.downvotes} </button>
            </div>
          </div>
        </div>
      )}
    else{
      return (
        <div className="btn-dark submission">
          <div className="row px-3">
            <div className="p avenir col-md-10 text-center py-3">
              {this.props.content}
            </div>
            <div className="col-md-2 py-2">
              <button className="btn btn-lg btn-block btn-success" onClick={() => {this.submitVote(1, this.props.entryID)}}><i className="fa fa-arrow-alt-circle-up"></i></button>
              <button className="btn btn-lg btn-block btn-danger mt-0" onClick={() => {this.submitVote(-1, this.props.entryID)}}><i className="fas fa-arrow-alt-circle-down"></i></button>
            </div>
          </div>
        </div>
      )}
    }
}

const RulesPane = (props) => {
  return (
    <div className="col-md-4">
      <TimerPane
        timeLeft={props.timeLeft}
      />
      <ul className="list-group rounded">
        <li className="list-group-item avenir h3 text-center">
          Thread Info
        </li>
        <li className="list-group-item bg-light-purp">
          <i className="fa fa-lg fa-user-circle" aria-hidden="true"></i>
          <span className="mx-3">Current Entries</span>
          <span className="float-right threadStats">{props.entriesCount}</span>
        </li>
        <li className="list-group-item bg-light-purp">
          <i className="fa fa-lg fa-font"></i>
          <span className="mx-3">Max Characters</span>
          <span className="float-right threadStats">{props.maxChars}</span>
        </li>
        <li className="list-group-item bg-light-purp">
          <i className="fa fa-lg fa-list-alt" aria-hidden="true"></i>
          <span className="mx-3">Max Entries</span>
          <span className="float-right threadStats">{props.maxEntries}</span>
        </li>
        <li className="list-group-item bg-light-purp">
          <i className="fa fa-lg fa-user-circle" aria-hidden="true"></i>
          <span className="mx-3">Last Edited By</span>
          <span className="float-right threadStats">{props.lastAuthor}</span>
        </li>
        <li className="list-group-item bg-light-purp text-center">
          <button className="btn btn-lg btn-block btn-success my-3" onClick={props.submitContribution}>Submit</button>
        </li>
      </ul>
    </div>
  )
}

ReactDOM.render(
  <ThreadView />,
  document.getElementById('singleThread')
);

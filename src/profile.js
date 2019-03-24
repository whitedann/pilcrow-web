const Component = React.Component;

class ProfileWidget extends Component{
  constructor(){
    super()
    this.state = {
      contributions: [],
      currentSelectionOfContributions: [],
      numberOfBatchesOfContributions: 1,
      maxPages: 0,
      showNextPageButton: false
    }
    this.getUserContributions = this.getUserContributions.bind(this);
    this.getMoreContributions = this.getMoreContributions.bind(this);
    this.updateContributions = this.updateContributions.bind(this);
  }

  getUserContributions(){
    axios.get("http://" + window.location.hostname + ":3000/profile.json")
      .then(response => {
        this.setState({
          contributions: response.data.contributions.reverse(),
          currentSelectionOfContributions: response.data.contributions.reverse().slice(0,5),
          maxPages: (response.data.contributions.length / 5)
        });
      })
      .then(() => {
        //show nextpage button if only if max pages is greater than 1
        this.setState({
          showNextPageButton: this.state.maxPages > 1
        });
      })
      .catch(error => {
        console.log("error finding current user", error);
      });
  }

  getMoreContributions(){
    this.setState({
      numberOfBatchesOfContributions: this.state.numberOfBatchesOfContributions + 1
    }, () => {
      this.updateContributions();
    });
  }

  updateContributions(){
    this.setState({
      currentSelectionOfContributions: this.state.contributions.slice(0,5*this.state.numberOfBatchesOfContributions),
      showNextPageButton: this.state.maxPages > this.state.numberOfBatchesOfContributions
    });
  }

  componentDidMount(){
    this.getUserContributions();
  }

  render(){
    if(this.state.showNextPageButton){
      return (
        <div className="profileContainer mt-3">
          <h3 className="text-formal">Recent Contributions</h3>
          {this.state.currentSelectionOfContributions.map( cont =>
            <Contribution
              key={cont._id.toString()}
              content={cont.entry}
              storyID={cont.parentID}
              date={cont.createdAt}
              downvotes={cont.downvotes}
              upvotes={cont.upvotes}
            />
          )}
          <div className="row mt-2 text-center page-buttons">
            <button className="btn btn-light pageButtons col-md-12 bg-light-purp" onClick={this.getMoreContributions}>Show More
              <div>
                <i className="fas fa-arrow-alt-circle-down"></i>
              </div>
            </button>
          </div>
        </div>
      )
    }
    else{
      return (
        <div className="profileContainer mt-3">
          <h3 className="text-formal">Recent Contributions</h3>
          {this.state.currentSelectionOfContributions.map( cont =>
            <Contribution
              key={cont._id.toString()}
              content={cont.entry}
              storyID={cont.parentID}
              date={cont.createdAt}
              downvotes={cont.downvotes}
              upvotes={cont.upvotes}
            />
          )}
        </div>
      )
    }
  }
}

const Contribution = (props) => {
  return (
    <div className="bg-light rounded p-2 my-2 profileListing">
      <p className="font-italic text-secondary">Submitted on {props.date.slice(11,19)} {props.date.slice(0,10)}</p>
      <p>{props.content}</p>
      <div className="text-secondary">
        <a href={"/threads/" + props.storyID}>View thread</a>
        <span className="text-danger float-right ml-4">{props.downvotes}</span>
        <span className="text-success float-right">{props.upvotes}</span>
      </div>
    </div>
  )
}

ReactDOM.render(
  <ProfileWidget />,
  document.getElementById('profileWidget')
);

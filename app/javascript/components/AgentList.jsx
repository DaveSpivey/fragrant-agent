import React from "react";
import PropTypes from "prop-types";

class AgentList extends React.Component {

	constructor(props) {
		super(props);
		this.getAgentResults = this.getAgentResults.bind(this);
	}

	getAgentResults() {
		console.log("this.props", this.props);
		const agents = this.props.agents ? this.props.agents.map((agent, index) => {
			return (
				<div key={ index } className="agent" data-agent-id={ agent.id }>
					<div className="pi">
        				<div className="name">{ agent.name }</div>
        				<div className="brokerage">{ agent.brokerage }</div>
      				</div>
      				<div className="stats">
        				<div className="side-stats">
          					<b>Side:</b>{ `Buyers: ${agent.agent_stat.buyers} Sellers: ${agent.agent_stat.sellers}` }
        				</div>
				        <div className="type-stats">
				          	<b>Type:</b>{ `SFH: ${agent.agent_stat.sfh} Condo: ${agent.agent_stat.condo} Townhome: ${agent.agent_stat.townhome} Mobile: ${agent.agent_stat.mobile} Land: ${agent.agent_stat.land}` }
				        </div>
				        <div className="price-stats">
				          	<b>Price:</b>{ `$0 - $150k: ${agent.agent_stat.pr1} $150k - $300k: ${agent.agent_stat.pr2} $300k - $500k: ${agent.agent_stat.pr3} $500k - $750k: ${agent.agent_stat.pr4} $750k - $1m: ${agent.agent_stat.pr5} $1m+: ${agent.agent_stat.pr6}` }
				        </div>
			      	</div>
				</div>
			);
		}) : [];

		return (
			<div className="agent-list">
				{ agents }
			</div>
		);
	}

  	render () {
  		const { search } = this.props;
  		const agentResults = this.getAgentResults();
  		const searchText = `You searched for ${search.txn_side} a ${search.prop_type} at ${search.price_range.replace(/to/g, " to ").replace(/1mp/g, "1m p")}`;

    	return (
      		<React.Fragment>
      			<p className="search-results-message">{ searchText }</p>
        		{ agentResults }
      		</React.Fragment>
    );
  }
}

AgentList.propTypes = {
  	agents: PropTypes.arrayOf(
	  		PropTypes.shape({
  			id: PropTypes.number,
	    	name: PropTypes.string,
	    	brokerage: PropTypes.string,
	    	stats: PropTypes.PropTypes.shape({
	    		buyers: PropTypes.number,
	    		sellers: PropTypes.number,
	    		sfh: PropTypes.number,
	    		condo: PropTypes.number,
	    		townhome: PropTypes.number,
	    		mobile: PropTypes.number,
	    		land: PropTypes.number,
	    		pr1: PropTypes.number,
	    		pr2: PropTypes.number,
	    		pr3: PropTypes.number,
	    		pr4: PropTypes.number,
	    		pr5: PropTypes.number,
	    		pr6: PropTypes.number,
	    	})
	  	})
	),
  	search: PropTypes.shape({
  		txn_side: PropTypes.string,
  		prop_type: PropTypes.string,
  		price_range: PropTypes.string
  	})
};

export default AgentList

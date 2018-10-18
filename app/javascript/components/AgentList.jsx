import React from "react";
import PropTypes from "prop-types";

class AgentList extends React.Component {

	constructor(props) {
		super(props);

		this.state = { 
			agentAvatars: [],
			customerFilter: "",
			propertyFilter: ""
		};

		// Bind class methods once on init
		this.getAgentResults = this.getAgentResults.bind(this);
		this.fetchAvatars = this.fetchAvatars.bind(this);
		this.filterAgents = this.filterAgents.bind(this);
		this.renderSearchFilters = this.renderSearchFilters.bind(this);
		this.changeCustomerFilter = this.changeCustomerFilter.bind(this);
		this.changePropertyFilter = this.changePropertyFilter.bind(this);
		this.getCurrentFiltersMessage = this.getCurrentFiltersMessage.bind(this);
		this.clearFilters = this.clearFilters.bind(this);
	}

	componentDidMount() {
		// Once we've mounted the component, grab avatars all at once, depending on agent count
		if (this.props.agents && this.props.agents.length) {
			this.fetchAvatars(this.props.agents.length);
		}
	}

	filterAgents() {
		const { agents } = this.props;
		const { customerFilter, propertyFilter } = this.state;
		let filteredAgents = agents;

		// Filter first by customer type
		if (customerFilter) {
			filteredAgents = this.filterForTarget(filteredAgents, customerFilter);
		}

		// then by property type
		if (propertyFilter) {
			const target = propertyFilter === "luxury" ? "pr6" : propertyFilter
			filteredAgents = this.filterForTarget(filteredAgents, target);
		}

		return filteredAgents;
	}

	// Sorts by filter type, descending, then arbitrarily returns the top half of the results
	filterForTarget(agents, target) {
		return agents.sort((agentA, agentB) => agentB.agent_stat[target] - agentA.agent_stat[target])
					 .slice(0, agents.length / 2);
	}

	renderSearchFilters() {
		const { customerFilter, propertyFilter } = this.state;
  		const currentFiltersMessage = this.getCurrentFiltersMessage();

		return (
			<div className="search-filters">
				<p className="filter-header">
					Filter results by:
				</p>
				<form className="filter-form customer-filter">
					<fieldset>
						<input type="radio" 
							   name="customer" 
							   value="buyers" 
							   checked={ customerFilter === "buyers" }
							   onChange={ this.changeCustomerFilter } />
						   	Buyers<br/>
						<input type="radio" 
							   name="customer" 
							   value="sellers" 
							   checked={ customerFilter === "sellers" }
							   onChange={ this.changeCustomerFilter } />
						   	Sellers
					</fieldset>
				</form>
				<form className="filter-form property-filter">
					<fieldset>
						<input type="radio" 
							   name="property" 
							   value="sfh"
							   checked={ propertyFilter === "sfh" }
							   onChange={ this.changePropertyFilter } />
						   	SFH<br/>
  						<input type="radio" 
  							   name="property" 
  							   value="condo"
							   checked={ propertyFilter === "condo" }
							   onChange={ this.changePropertyFilter } />
						    Condo<br/>
						<input type="radio" 
							   name="property" 
							   value="luxury"
							   checked={ propertyFilter === "luxury" }
							   onChange={ this.changePropertyFilter } />
						    Luxury
					</fieldset>
				</form>
				{ currentFiltersMessage }
			</div>
		);
	}

	changeCustomerFilter(event) {
		const filter = event.target.value;
		this.setState({ customerFilter: filter });
	}

	changePropertyFilter(event) {
		const filter = event.target.value;
		this.setState({ propertyFilter: filter });
	}

	getCurrentFiltersMessage() {
  		const { customerFilter, propertyFilter } = this.state;

  		if (customerFilter || propertyFilter) {
  			const filtersMessage = `Filtering for: ${customerFilter}${customerFilter && propertyFilter ? ", " : ""}${propertyFilter}`;
  			const clearButton = <button className="filter-clear-button" onClick={ this.clearFilters }>Clear filters</button>;

  			return (
  				<div className="current-filters-message">
  					<div className="filters-message-text">{ filtersMessage }</div>
  					{ clearButton }
  				</div>
			);
  		}

  		return null;
	}

	clearFilters() {
		this.setState({ customerFilter: "", propertyFilter: "" });
	}

	fetchAvatars(count) {
		fetch(`https://randomuser.me/api/?results=${count}`, {
	      	headers: {
	        	'Accept': 'application/json',
	        	'Content-Type': 'application/json'
	      	},
	      	method: 'GET'
	    })
	    .then((response) => response.json())
	    .then((data) => {
	      	if (data && data.results) {
	      		// Keep avatar data in local state for cards to access
	        	this.setState({ agentAvatars: data.results });
	      	} else {
	        	console.warn("Ruh roh! No avatar data.");
	      	}
	    })
	    .catch((error) => {
	      	console.error(error);
	    });
	}

	getAgentResults() {
		const avatars = this.state.agentAvatars;
		const filteredAgents = this.props.agents ? this.filterAgents() : [];

		const agents = filteredAgents.map((agent, index) => {
			// Match agent in the list to avatar at same index in the avatar array
			const agentPic = avatars[index] ? (
				<div className="avatar-wrapper">
					<img className="avatar" src={ avatars[index].picture.medium } alt="agent photo" />
				</div>
			) : null;

			return (
				<div key={ index } className="agent" data-agent-id={ agent.id }>
					<div className="pi">
						<div className="agent-profile">
							{ agentPic }
						</div>
						<div className="agent-info">
        					<div className="name">{ agent.name }</div>
        					<div className="brokerage">{ agent.brokerage }</div>
        				</div>
      				</div>
      				<div className="stats">
        				<div className="side-stats">
          					<b>Side:</b>
          					{
          						` Buyers: ${agent.agent_stat.buyers} 
          						Sellers: ${agent.agent_stat.sellers}` 
          					}
        				</div>
				        <div className="type-stats">
				          	<b>Type:</b>
				          	{ 
				          		` SFH: ${agent.agent_stat.sfh} 
				          	   	Condo: ${agent.agent_stat.condo} 
			          	   		Townhome: ${agent.agent_stat.townhome} 
				          	   	Mobile: ${agent.agent_stat.mobile} 
				          	   	Land: ${agent.agent_stat.land}`
				          	}
				        </div>
				        <div className="price-stats">
				          	<b>Price:</b>
				          	{
				          		` $0 - $150k: ${agent.agent_stat.pr1} 
				          		$150k - $300k: ${agent.agent_stat.pr2} 
				          		$300k - $500k: ${agent.agent_stat.pr3} 
				          		$500k - $750k: ${agent.agent_stat.pr4} 
				          		$750k - $1m: ${agent.agent_stat.pr5} 
				          		$1m+: ${agent.agent_stat.pr6}`
				          	}
				        </div>
			      	</div>
				</div>
			);
		});

		return (
			<div className="agent-list">
				{ agents }
			</div>
		);
	}

  	render () {
  		const { search } = this.props;

  		const searchFilters = this.renderSearchFilters();
  		const agentResults = this.getAgentResults();

    	return (
      		<React.Fragment>
      			{ searchFilters }
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
	    	agent_stat: PropTypes.PropTypes.shape({
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
	    		pr6: PropTypes.number
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

class AgentSearchesController < ApplicationController

  def show
    @search = AgentSearch.find(params[:id])
    agent_list = Agent.where(id: @search.agent_ids.split(","))

    # well this is not ideal - breaking out properties to be accessible to the react component
    @agents = agent_list.map do |agent|
      {
        id: agent.id,
        name: agent.name,
        brokerage: agent.brokerage,
        agent_stat: {
          buyers: agent.agent_stat.buyers,
          sellers: agent.agent_stat.sellers,
          sfh: agent.agent_stat.sfh,
          condo: agent.agent_stat.condo,
          townhome: agent.agent_stat.townhome,
          mobile: agent.agent_stat.mobile,
          land: agent.agent_stat.land,
          pr1: agent.agent_stat.pr1,
          pr2: agent.agent_stat.pr2,
          pr3: agent.agent_stat.pr3,
          pr4: agent.agent_stat.pr4,
          pr5: agent.agent_stat.pr5,
          pr6: agent.agent_stat.pr6
        }
      }
    end

  end

  def create
    search = AgentSearch.new(params.permit(:txn_side, :prop_type, :price_range))
    
    if search.txn_side.blank? || search.prop_type.blank? || search.price_range.blank?
      redirect_to(root_path)
      return
    end
    
    search.find_agent_matches!

    if search.save
      redirect_to agent_search_path(search)
    end

  end

end

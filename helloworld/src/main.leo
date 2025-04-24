program voteuva4232025.aleo {
    // — Data Structures —
    struct ProposalInfo {
        title:    field,
        content:  field,
        proposer: address,
    }

    record Proposal {
        owner: address,
        id:    field,
        info:  ProposalInfo,
    }

    record Ticket {
        owner: address,
        pid:   field,
    }

    record Vote {
        owner: address,
        pid:   field,
        vote:  u64,
    }

    // — Public Mappings —
    mapping proposals:      field => ProposalInfo;
    mapping tickets:        field => u64;
    mapping agree_votes:    field => u64;
    mapping disagree_votes: field => u64;

    // — Transitions —

    async transition propose(
        public title:    field,
        public content:  field,
        public proposer: address
    ) -> (Proposal, Future) {
        assert_eq(self.caller, proposer);

        let info: ProposalInfo = ProposalInfo {
            title:    title,
            content:  content,
            proposer: proposer
        };

        let id: field = title; // Use the title as the unique key

        return (
            Proposal { owner: proposer, id, info },
            finalize_propose(id, info)
        );
    }

    async function finalize_propose(
        public id:   field,
        public info: ProposalInfo
    ) {
        Mapping::set(proposals,      id, info);
        Mapping::set(tickets,        id, 0u64);
        Mapping::set(agree_votes,    id, 0u64);
        Mapping::set(disagree_votes, id, 0u64);
    }

    async transition new_ticket(
        public pid:   field,
        public voter: address
    ) -> (Ticket, Future) {
        return (
            Ticket { owner: voter, pid },
            finalize_new_ticket(pid)
        );
    }

    async function finalize_new_ticket(public pid: field) {
        let n: u64 = Mapping::get_or_use(tickets, pid, 0u64);
        Mapping::set(tickets, pid, n + 1u64);
    }

    async transition agree(ticket: Ticket) -> (Vote, Future) {
        return (
            Vote { owner: ticket.owner, pid: ticket.pid, vote: 1u64 },
            finalize_agree(ticket.pid)
        );
    }

    async function finalize_agree(public pid: field) {
        let n: u64 = Mapping::get_or_use(agree_votes, pid, 0u64);
        Mapping::set(agree_votes, pid, n + 1u64);
    }

    async transition disagree(ticket: Ticket) -> (Vote, Future) {
        return (
            Vote { owner: ticket.owner, pid: ticket.pid, vote: 0u64 },
            finalize_disagree(ticket.pid)
        );
    }

    async function finalize_disagree(public pid: field) {
        let n: u64 = Mapping::get_or_use(disagree_votes, pid, 0u64);
        Mapping::set(disagree_votes, pid, n + 1u64);
    }
}
